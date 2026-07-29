import React from 'react';

export default function Modal({ isOpen, title, subtitle, onClose, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-card__header">
          <div>
            {title ? <h3>{title}</h3> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-card__body">{children}</div>

        {footer ? <div className="modal-card__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
