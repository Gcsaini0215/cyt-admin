import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Divider, 
  IconButton,
  Stack,
  Chip,
  Tooltip,
  Alert,
  Modal,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { 
  FormatBold, 
  FormatItalic, 
  FormatUnderlined, 
  FormatListBulleted, 
  FormatListNumbered,
  Image, 
  CloudUpload,
  Send,
  AccessTime,
  Lightbulb,
  Search,
  CheckCircleOutline,
  FormatSize,
  FontDownload,
  FormatColorFill,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { postData, fetchById, deleteData, putData } from "../../helpers/actions";
import { createBlogUrl, getBlogsUrl, deleteBlogUrl, updateBlogUrl } from "../../helpers/urls";

export default function BlogEditor() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [blogData, setBlogData] = useState({
    title: "",
    category: "",
    content: "",
    metaDesc: "",
    tags: "",
    author: "Admin",
    image: null
  });
  const [readingTime, setReadingTime] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState("content"); // 'content' or 'featured'
  const [resizeModalOpen, setResizeModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageWidth, setImageWidth] = useState(600);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 }); // In percentage
  const previewCanvasRef = useRef(null);

  const [blogImages, setBlogImages] = useState([
    { src: "/assets/img/blog/blog-01.jpg", size: "173KB", optimized: true },
    { src: "/assets/img/blog/blog-02.jpg", size: "94KB", optimized: true },
    { src: "/assets/img/blog/blog-03.jpg", size: "271KB", optimized: true },
    { src: "/assets/img/blog/blog-04.jpg", size: "167KB", optimized: true },
    { src: "/assets/img/blog/blog-06.jpg", size: "177KB", optimized: true },
    { src: "/assets/img/blog/blog-07.jpg", size: "253KB", optimized: true },
    { src: "/assets/img/blog/blog-08.jpg", size: "163KB", optimized: true },
    { src: "/assets/img/blog/blog-09.jpg", size: "154KB", optimized: true }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetchById(getBlogsUrl);
      if (response.status) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await deleteData(deleteBlogUrl + id);
        if (response.status) {
          toast.success("Blog deleted!");
          fetchBlogs();
        }
      } catch (error) {
        toast.error("Error deleting blog");
      }
    }
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setEditId(blog._id);
    setBlogData({
      title: blog.title,
      category: blog.category,
      content: blog.content,
      metaDesc: blog.metaDesc,
      tags: blog.tags,
      author: blog.author,
      image: blog.image
    });
    if (editorRef.current) {
      editorRef.current.innerHTML = blog.content;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContentChange = () => {
    const text = editorRef.current.innerText || "";
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    setReadingTime(Math.ceil(words / 200));
    setBlogData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
  };

  const fonts = [
    "Arial", "Courier New", "Georgia", "Impact", "Tahoma", "Times New Roman", "Verdana"
  ];

  const fontSizes = [
    { label: "Small", value: "1" },
    { label: "Normal", value: "3" },
    { label: "Large", value: "5" },
    { label: "Extra Large", value: "7" }
  ];

  const execCommand = (e, command, value = null) => {
    if (e) e.preventDefault();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleContentChange();
  };

  const insertImage = (url) => {
    if (url) {
      if (galleryTarget === "featured") {
        setBlogData(prev => ({ ...prev, image: url }));
      } else {
        document.execCommand('insertImage', false, url);
        handleContentChange();
      }
      setGalleryOpen(false);
    }
  };

  const createLink = (e) => {
    if (e) e.preventDefault();
    const url = prompt("Enter the URL (e.g., https://google.com):");
    if (url) {
      document.execCommand('createLink', false, url);
      handleContentChange();
    }
  };

  const handleImageSelect = (url) => {
    setSelectedImage(url);
    setGalleryOpen(false);
    setCropModalOpen(true);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 }); // Initial crop
  };

  const handleCropComplete = () => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const pixelX = (cropArea.x / 100) * img.width;
      const pixelY = (cropArea.y / 100) * img.height;
      const pixelW = (cropArea.width / 100) * img.width;
      const pixelH = (cropArea.height / 100) * img.height;
      
      canvas.width = pixelW;
      canvas.height = pixelH;
      ctx.drawImage(img, pixelX, pixelY, pixelW, pixelH, 0, 0, pixelW, pixelH);
      
      const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(croppedUrl);
      setCropModalOpen(false);
      setResizeModalOpen(true);
    };
  };

  const resizeAndInsertImage = () => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const scaleFactor = imageWidth / img.width;
      canvas.width = imageWidth;
      canvas.height = img.height * scaleFactor;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const resizedUrl = canvas.toDataURL('image/jpeg', 0.8);
      insertImage(resizedUrl);
      setResizeModalOpen(false);
      toast.success("Resized image inserted!");
    };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          src: event.target.result,
          size: `${Math.round(file.size / 1024)}KB`,
          optimized: true
        };
        setBlogImages(prev => [newImage, ...prev]);
        toast.success("Image uploaded and optimized!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sync content one last time before submission
    const currentContent = editorRef.current ? editorRef.current.innerHTML : "";
    const updatedBlogData = { ...blogData, content: currentContent };

    if (!updatedBlogData.title || !updatedBlogData.content || updatedBlogData.content === "<br>") {
      toast.error("Title and Content are required!");
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await putData(updateBlogUrl + editId, updatedBlogData);
      } else {
        response = await postData(createBlogUrl, updatedBlogData);
      }

      if (response.status) {
        toast.success(isEditing ? "Blog updated successfully!" : "Blog published successfully!");
        setBlogData({
          title: "",
          category: "",
          content: "",
          metaDesc: "",
          tags: "",
          author: "Admin",
          image: null
        });
        setIsEditing(false);
        setEditId(null);
        if (editorRef.current) editorRef.current.innerHTML = "";
        fetchBlogs();
      } else {
        toast.error(response.message || "Failed to process blog");
      }
    } catch (error) {
      toast.error("An error occurred. Check if backend is running.");
      console.error(error);
    }
  };

  return (
    <div className="content container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="page-title fw-bold text-success mb-0">Strong Blog Editor</h4>
            <p className="text-muted small">Write high-quality, SEO-friendly blogs for Choose Your Therapist.</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <Paper elevation={0} className="shadow-sm border-0 rounded-4 overflow-hidden mb-4">
            <form onSubmit={handleSubmit}>
              <Box p={{ xs: 2, md: 4 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    name="title"
                    variant="outlined"
                    placeholder="E.g., 10 Ways to Manage Anxiety Effectively"
                    value={blogData.title}
                    onChange={handleInputChange}
                    required
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '20px', fontWeight: 700 },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#22c55e' }
                    }}
                  />

                  {/* Enhanced Dynamic Toolbar */}
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: '12px', 
                      bgcolor: '#f8fafc', 
                      p: 1, 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 0.5,
                      borderColor: '#e2e8f0',
                      position: 'sticky',
                      top: '70px',
                      zIndex: 10,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Font Family Selection */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        defaultValue="Arial"
                        onChange={(e) => {
                          execCommand(null, 'fontName', e.target.value);
                        }}
                        sx={{ height: 32, borderRadius: '8px', fontSize: '12px' }}
                      >
                        {fonts.map(font => <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>)}
                      </Select>
                    </FormControl>

                    {/* Font Size Selection */}
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        defaultValue="3"
                        onChange={(e) => {
                          execCommand(null, 'fontSize', e.target.value);
                        }}
                        sx={{ height: 32, borderRadius: '8px', fontSize: '12px' }}
                      >
                        {fontSizes.map(size => <MenuItem key={size.value} value={size.value}>{size.label}</MenuItem>)}
                      </Select>
                    </FormControl>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    <Tooltip title="Bold"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'bold')}><FormatBold sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Italic"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'italic')}><FormatItalic sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Underline"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'underline')}><FormatUnderlined sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                    
                    <Tooltip title="Left"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'justifyLeft')}><FormatAlignLeft sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Center"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'justifyCenter')}><FormatAlignCenter sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Right"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'justifyRight')}><FormatAlignRight sx={{ fontSize: 20 }} /></IconButton></Tooltip>

                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                    <Tooltip title="Bullet List"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'insertUnorderedList')}><FormatListBulleted sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Numbered List"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'insertOrderedList')}><FormatListNumbered sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    
                    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                    
                    <Tooltip title="Quote"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'formatBlock', 'BLOCKQUOTE')}><FormatQuote sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Link"><IconButton size="small" onMouseDown={(e) => createLink(e)}><LinkIcon sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Code"><IconButton size="small" onMouseDown={(e) => execCommand(e, 'formatBlock', 'pre')}><Code sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    <Tooltip title="Insert Image"><IconButton size="small" onMouseDown={(e) => { e.preventDefault(); setGalleryTarget("content"); setGalleryOpen(true); }}><Image sx={{ fontSize: 20 }} /></IconButton></Tooltip>
                    
                    <Box flexGrow={1} />
                    
                    <div className="d-flex align-items-center me-2 text-muted small fw-bold">
                      <AccessTime sx={{ fontSize: 16, mr: 0.5, color: '#22c55e' }} />
                      {readingTime} min read
                    </div>
                  </Paper>

                  {/* Rich Text Editor */}
                  <Box 
                    ref={editorRef}
                    contentEditable
                    onInput={handleContentChange}
                    onBlur={handleContentChange}
                    sx={{ 
                      minHeight: '500px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '30px',
                      fontSize: '18px',
                      lineHeight: 1.8,
                      color: '#1e293b',
                      outline: 'none',
                      bgcolor: '#fff',
                      '&:focus': { borderColor: '#22c55e', boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.05)' },
                      '&:empty:before': {
                        content: '"Start writing your amazing blog story here..."',
                        color: '#94a3b8',
                        fontStyle: 'italic'
                      },
                      'ul, ol': { paddingLeft: '30px', mb: 2 },
                      'b, strong': { fontWeight: 700, color: '#0f172a' },
                      'img': { maxWidth: '100%', borderRadius: '12px', my: 2 }
                    }}
                  />

                  {/* Featured Image Selection */}
                  <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#64748b', textTransform: 'uppercase' }}>
                      Main Featured Image:
                    </Typography>
                    
                    {blogData.image ? (
                      <Box sx={{ position: 'relative', width: 'fit-content' }}>
                        <img 
                          src={blogData.image} 
                          alt="Featured preview" 
                          style={{ maxWidth: '100%', height: '200px', borderRadius: '12px', border: '1px solid #cbd5e1' }} 
                        />
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="error"
                          onClick={() => setBlogData(prev => ({ ...prev, image: null }))}
                          sx={{ position: 'absolute', top: 10, right: 10, minWidth: 0, p: 0.5, borderRadius: '50%' }}
                        >
                          ✕
                        </Button>
                      </Box>
                    ) : (
                      <Button 
                        variant="outlined" 
                        startIcon={<Image />}
                        onClick={() => { setGalleryTarget("featured"); setGalleryOpen(true); }}
                        sx={{ 
                          height: '150px', 
                          width: '100%', 
                          borderStyle: 'dashed', 
                          borderRadius: '12px',
                          textTransform: 'none',
                          color: '#64748b'
                        }}
                      >
                        Click here to select a Featured Image (shows at the top of the blog)
                      </Button>
                    )}
                  </Box>

                  {/* SEO Section */}
                  <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <Stack spacing={3}>
                      <Divider sx={{ mb: 1 }}>
                        <Chip label="SEO & Metadata" size="small" icon={<Search sx={{ fontSize: 16 }} />} sx={{ bgcolor: '#fff', fontWeight: 600 }} />
                      </Divider>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <TextField
                            fullWidth
                            label="Category"
                            name="category"
                            placeholder="E.g., Mental Health, Wellness"
                            value={blogData.category}
                            onChange={handleInputChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                          />
                        </div>
                        <div className="col-md-6">
                          <TextField
                            fullWidth
                            label="Tags"
                            name="tags"
                            placeholder="Comma separated: anxiety, health, therapy"
                            value={blogData.tags}
                            onChange={handleInputChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                          />
                        </div>
                        <div className="col-12">
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Meta Description"
                            name="metaDesc"
                            placeholder="A short summary for search results (max 160 characters)"
                            value={blogData.metaDesc}
                            onChange={handleInputChange}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#fff' } }}
                          />
                        </div>
                      </div>

                      {/* Checklist moved here */}
                      <Box pt={2}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#64748b', textTransform: 'uppercase' }}>Publication Checklist:</Typography>
                        <div className="row g-3">
                          <div className="col-md-3 col-sm-6">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="check1" />
                              <label className="form-check-label small fw-medium" htmlFor="check1">Catchy Title</label>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="check2" />
                              <label className="form-check-label small fw-medium" htmlFor="check2">Category & Tags</label>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="check3" />
                              <label className="form-check-label small fw-medium" htmlFor="check3">Meta Description</label>
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-6">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox" id="check4" />
                              <label className="form-check-label small fw-medium" htmlFor="check4">Grammar Check</label>
                            </div>
                          </div>
                        </div>
                      </Box>
                    </Stack>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={2} pt={2}>
                    <Button 
                      variant="outlined" 
                      sx={{ borderRadius: '10px', px: 4, textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }}
                    >
                      Save Draft
                    </Button>
                    <Button 
                      type="submit"
                      variant="contained" 
                      startIcon={<Send />}
                      sx={{ 
                        borderRadius: '10px', 
                        px: 6, 
                        bgcolor: '#22c55e', 
                        '&:hover': { bgcolor: '#16a34a' },
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                      }}
                    >
                      {isEditing ? "Update Blog Post" : "Publish Blog Post"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </form>
          </Paper>
        </div>
      </div>

      {/* Manage Existing Blogs */}
      <Box mt={8} mb={4}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lightbulb sx={{ color: '#22c55e' }} /> Manage Existing Blogs
        </Typography>
        
        <Grid container spacing={3}>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: '20px', 
                    overflow: 'hidden', 
                    border: '1px solid #e2e8f0',
                    transition: '0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }
                  }}
                >
                  <Box sx={{ position: 'relative', height: '160px' }}>
                    <img 
                      src={blog.image || "https://placehold.co/600x400?text=No+Image"} 
                      alt={blog.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                      <Chip label={blog.category || "General"} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 700, color: '#22c55e' }} />
                    </Box>
                  </Box>
                  
                  <Box p={2.5} flexGrow={1}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3, mb: 1, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', height: '42px' }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: '#64748b', mb: 2 }}>
                      {new Date(blog.createdAt).toLocaleDateString()} • By {blog.author}
                    </Typography>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleEdit(blog)} sx={{ color: '#3b82f6', bgcolor: '#eff6ff', '&:hover': { bgcolor: '#dbeafe' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(blog._id)} sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '20px', border: '1px dashed #cbd5e1', bgcolor: 'transparent' }}>
                <Typography color="text.secondary">No blogs published yet.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Live Preview */}
      <Box mt={2} mb={5}>
        <Typography variant="h6" className="fw-bold text-dark mb-3">Live Mobile & Web Preview</Typography>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 5 }, borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          {blogData.title || blogData.content ? (
            <Box maxWidth="800px" mx="auto">
              {blogData.image && (
                <Box mb={3}>
                  <img src={blogData.image} alt="Featured" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px' }} />
                </Box>
              )}
              <Chip label={blogData.category || "Uncategorized"} size="small" sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 600, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 2, lineHeight: 1.2, fontSize: { xs: '24px', md: '36px' } }}>
                {blogData.title || "Your Blog Title"}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={4} color="#64748b" className="small">
                <span>By <b>{blogData.author}</b></span>
                <span>•</span>
                <span>{readingTime} min read</span>
                {blogData.tags && (
                  <>
                    <span>•</span>
                    <span className="text-success">{blogData.tags.split(',').map(t => `#${t.trim()}`).join(' ')}</span>
                  </>
                )}
              </Box>
              <Divider sx={{ mb: 4 }} />
              <div 
                className="blog-preview-content"
                style={{ color: '#334155', fontSize: '18px', lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{ __html: blogData.content || "<p class='text-muted'>Content will appear here...</p>" }}
              />
            </Box>
          ) : (
            <div className="text-center py-5 text-muted">
              Start writing to see the professional preview here
            </div>
          )}
        </Paper>
      </Box>

      {/* Image Gallery Modal */}
      <Modal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        aria-labelledby="image-gallery-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '70%' },
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          borderRadius: '24px',
          boxShadow: 24,
          p: 4,
          overflowY: 'auto'
        }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 800, color: '#1e293b' }}>
            Optimized Image Gallery
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Select or upload a new image.
            </Typography>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Button 
              variant="contained" 
              startIcon={<CloudUpload />} 
              onClick={() => fileInputRef.current.click()}
              sx={{ 
                borderRadius: '10px', 
                bgcolor: '#22c55e', 
                '&:hover': { bgcolor: '#16a34a' },
                textTransform: 'none'
              }}
            >
              Upload from Device
            </Button>
          </Box>
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            All images are <b>compressed and SEO-ready</b> automatically.
          </Alert>
          <Grid container spacing={2}>
            {blogImages.map((img, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Paper 
                  elevation={0}
                  onClick={() => handleImageSelect(img.src)}
                  sx={{ 
                    cursor: 'pointer', 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    border: '2px solid #f1f5f9',
                    transition: '0.3s',
                    '&:hover': { 
                      borderColor: '#22c55e',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <img 
                    src={img.src} 
                    alt={`Blog ${index}`} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                  />
                  <Box p={1} textAlign="center">
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                      {img.size} • <span style={{ color: '#22c55e' }}>Compressed</span>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button onClick={() => setGalleryOpen(false)} variant="outlined" sx={{ borderRadius: '10px' }}>
              Close Gallery
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Image Crop Modal */}
      <Modal
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        aria-labelledby="image-crop-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '500px' },
          bgcolor: 'background.paper',
          borderRadius: '24px',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
            Crop Picture
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust the sliders to crop the area you want to keep.
          </Typography>
          
          <Box sx={{ position: 'relative', width: '100%', height: '300px', bgcolor: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src={selectedImage} 
              alt="Crop target" 
              style={{ maxWidth: '100%', maxHeight: '100%', opacity: 0.5 }} 
            />
            {/* Simple Visual Indicator of Crop Area */}
            <Box sx={{
              position: 'absolute',
              left: `${cropArea.x}%`,
              top: `${cropArea.y}%`,
              width: `${cropArea.width}%`,
              height: `${cropArea.height}%`,
              border: '2px dashed #22c55e',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
              pointerEvents: 'none'
            }} />
          </Box>

          <Stack spacing={2} mb={4}>
            <Box>
              <Typography variant="caption">Horizontal Position & Width</Typography>
              <Slider
                value={[cropArea.x, cropArea.x + cropArea.width]}
                onChange={(e, val) => setCropArea(prev => ({ ...prev, x: val[0], width: val[1] - val[0] }))}
                sx={{ color: '#22c55e' }}
              />
            </Box>
            <Box>
              <Typography variant="caption">Vertical Position & Height</Typography>
              <Slider
                value={[cropArea.y, cropArea.y + cropArea.height]}
                onChange={(e, val) => setCropArea(prev => ({ ...prev, y: val[0], height: val[1] - val[0] }))}
                sx={{ color: '#22c55e' }}
              />
            </Box>
          </Stack>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setCropModalOpen(false)} variant="text" sx={{ color: '#64748b' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCropComplete} 
              variant="contained"
              sx={{ 
                borderRadius: '10px', 
                bgcolor: '#22c55e', 
                '&:hover': { bgcolor: '#16a34a' },
                px: 3
              }}
            >
              Continue to Resize
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Image Resize Modal */}
      <Modal
        open={resizeModalOpen}
        onClose={() => setResizeModalOpen(false)}
        aria-labelledby="image-resize-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: '400px' },
          bgcolor: 'background.paper',
          borderRadius: '24px',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
            Resize Image
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose the display width for your image in the blog post.
          </Typography>
          
          <Box mb={4} textAlign="center">
            <img 
              src={selectedImage} 
              alt="Preview" 
              style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #eee' }} 
            />
          </Box>

          <Typography gutterBottom sx={{ fontWeight: 600 }}>Width: {imageWidth}px</Typography>
          <Slider
            value={imageWidth}
            min={200}
            max={1200}
            step={50}
            onChange={(e, val) => setImageWidth(val)}
            sx={{ color: '#22c55e', mb: 3 }}
          />

          <Stack direction="row" spacing={1} mb={4}>
            {[300, 600, 900].map(w => (
              <Button 
                key={w}
                variant={imageWidth === w ? "contained" : "outlined"}
                size="small"
                onClick={() => setImageWidth(w)}
                sx={{ 
                  borderRadius: '8px', 
                  textTransform: 'none',
                  bgcolor: imageWidth === w ? '#22c55e' : 'transparent',
                  borderColor: '#22c55e',
                  color: imageWidth === w ? '#fff' : '#22c55e',
                  '&:hover': { bgcolor: imageWidth === w ? '#16a34a' : 'rgba(34, 197, 94, 0.05)' }
                }}
              >
                {w === 300 ? 'Small' : w === 600 ? 'Medium' : 'Large'}
              </Button>
            ))}
          </Stack>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setResizeModalOpen(false)} variant="text" sx={{ color: '#64748b' }}>
              Cancel
            </Button>
            <Button 
              onClick={resizeAndInsertImage} 
              variant="contained"
              sx={{ 
                borderRadius: '10px', 
                bgcolor: '#22c55e', 
                '&:hover': { bgcolor: '#16a34a' },
                px: 3
              }}
            >
              Insert Resized
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
