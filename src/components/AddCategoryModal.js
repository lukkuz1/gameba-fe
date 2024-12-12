import React from "react";
import "./Modal.css";

const AddCategoryModal = ({
  isOpen,
  onClose,
  newCategory,
  setNewCategory,
  handleAddCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Category</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.Name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, Name: e.target.value })
          }
        />
        <textarea
          placeholder="Category Description"
          value={newCategory.Description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, Description: e.target.value })
          }
        />
        <div className="modal-buttons">
          <button onClick={handleAddCategory} className="gameba-submit-button">
            Add
          </button>
          <button onClick={onClose} className="gameba-modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
