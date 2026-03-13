import React from "react";
import { toast } from "react-toastify";
import { postData } from "../../helpers/actions";
import { UpdatePaymentStatusUrl } from "../../helpers/urls";

const styles = {
    selectStyle: {
        lineHeight: "20px",
        height: "35px",
        width:"100%",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        padding: "0 8px",
        fontSize: "12px",
        color: "#475569",
        backgroundColor: "#fff"
    },
};
export default function PaymentStatusWidget({ item, statusList }) {
    const [paymentStatus, setPaymentStatus] = React.useState(item.transaction?.status?._id);
    const [loading, setLoading] = React.useState(false);


    const handleStatusChange = async (e) => {
        const value = e.target.value;
        setPaymentStatus(value);
        await callAPi(value);
    };

    const callAPi = async (value) => {
        try {
            setLoading(true);
            const data = {
                statusId: value,
                transactionId: item.transaction._id
            }

            const res = await postData(UpdatePaymentStatusUrl, data);
            if (res.status) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }

    };

    return <div className="d-flex flex-column align-items-center">
        <span style={{fontSize:"11px", color: "#64748b"}} className="mb-1">{item.transaction._id}</span>
        <select
            style={styles.selectStyle}
            value={paymentStatus}
            onChange={handleStatusChange}
            disabled={loading}
            className="form-select form-select-sm"
        >
            {statusList && statusList.map((status) => {
                return (
                    <option value={status._id} key={status._id}>
                        {status.name}
                    </option>
                );
            })}
        </select>
    </div>
}
