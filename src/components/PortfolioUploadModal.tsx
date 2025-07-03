import PropTypes from "prop-types";

import "../styles/components.css";
import { useState } from "react";

import { createPortfolio } from "../services/portfolioService";

const CATEGORY_OPTIONS = [
  "YOLO",
  "LOSSES",
  "BOOMER",
  "GAINS",
  "CRYPTO",
  "OPTIONS",
  "OTHER",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const PortfolioUploadModal = ({
  isOpen,
  onClose,
  onSuccess
}: any) => {
  const [form, setForm] = useState({
    category: "OTHER",
    description: "",
    image: null,
    performance: "",
    title: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleChange = (e: any) => {
    const { files, name, value } = e.target;
    if (name === "image") {
      const file = files[0];
      if (!file) return;
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Invalid file type. Only JPG, PNG, and GIF allowed.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("File too large. Max size is 5MB.");
        return;
      }
      setForm((prev) => ({ ...prev, image: file }));
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    // Validation
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (form.title.length > 200) {
      setError("Title must be 200 characters or less.");
      return;
    }
    if (form.description.length > 1000) {
      setError("Description must be 1000 characters or less.");
      return;
    }
    if (form.performance.length > 50) {
      setError("Performance must be 50 characters or less.");
      return;
    }
    if (!form.image) {
      setError("Image is required.");
      return;
    }
    // File validation already handled in handleChange
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("performance", form.performance);
      formData.append("category", form.category);
      formData.append("image", form.image);
      const result = await createPortfolio(formData);
      if (result.success) {
        setSuccess(true);
        setForm({
          category: "OTHER",
          description: "",
          image: null,
          performance: "",
          title: "",
        });
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess(result.data);
      } else {
        setError(result.error || "Failed to upload portfolio.");
      }
    } catch (err) {
      setError("Error uploading portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      category: "OTHER",
      description: "",
      image: null,
      performance: "",
      title: "",
    });
    setPreviewUrl("");
    setError("");
    setSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Your Portfolio</h2>
        <form className="upload-form" onSubmit={handleSubmit}>
          <label>
            Title <span className="required">*</span>
            <input
              disabled={loading}
              maxLength={200}
              name="title"
              onChange={handleChange}
              required
              type="text"
              value={form.title}
            />
          </label>
          <label>
            Description
            <textarea
              disabled={loading}
              maxLength={1000}
              name="description"
              onChange={handleChange}
              value={form.description}
            />
          </label>
          <label>
            Performance
            <input
              disabled={loading}
              maxLength={50}
              name="performance"
              onChange={handleChange}
              placeholder="e.g. +12.5% YTD"
              type="text"
              value={form.performance}
            />
          </label>
          <label>
            Category
            <select
              disabled={loading}
              name="category"
              onChange={handleChange}
              value={form.category}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
          <label>
            Image <span className="required">*</span>
            <input
              accept="image/jpeg,image/png,image/gif"
              disabled={loading}
              name="image"
              onChange={handleChange}
              ref={fileInputRef}
              required
              type="file"
            />
          </label>
          {previewUrl && (
            <div className="image-preview">
              <img
                alt="Preview"
                src={previewUrl}
                style={{ maxHeight: 200, maxWidth: 200 }}
              />
            </div>
          )}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && (
            <div className="alert alert-success">
              Portfolio uploaded successfully!
            </div>
          )}
          <div className="modal-actions">
            <button
              className="modal-button upload"
              disabled={loading}
              type="submit"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              className="modal-button cancel"
              disabled={loading}
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PortfolioUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default PortfolioUploadModal;
