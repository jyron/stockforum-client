import React, { useState, useRef } from "react";
import "../styles/components.css";
import PropTypes from "prop-types";
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

const PortfolioUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    performance: "",
    category: "OTHER",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;
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

  const handleSubmit = async (e) => {
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
          title: "",
          description: "",
          performance: "",
          category: "OTHER",
          image: null,
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
      title: "",
      description: "",
      performance: "",
      category: "OTHER",
      image: null,
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
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={200}
              required
              disabled={loading}
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
              disabled={loading}
            />
          </label>
          <label>
            Performance
            <input
              type="text"
              name="performance"
              value={form.performance}
              onChange={handleChange}
              maxLength={50}
              disabled={loading}
              placeholder="e.g. +12.5% YTD"
            />
          </label>
          <label>
            Category
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loading}
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
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleChange}
              ref={fileInputRef}
              disabled={loading}
              required
            />
          </label>
          {previewUrl && (
            <div className="image-preview">
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: 200, maxHeight: 200 }}
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
              type="submit"
              className="modal-button upload"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              className="modal-button cancel"
              onClick={handleClose}
              disabled={loading}
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
