"use client";
import { X } from "lucide-react";

interface ViewArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: any;
}

export default function ViewArtistModal({ isOpen, onClose, artist }: ViewArtistModalProps) {
  if (!isOpen || !artist) return null;

  return (
    <div className="modal-overlay">
      <div className="add-artist-modal" style={{
        maxWidth: "540px",
        borderRadius: "24px",
        overflow: "hidden"
      }}>
        
        {/* Header */}
        <div className="modal-header" style={{
          padding: "1.8rem 2.4rem 1.4rem",
          borderBottom: "1px solid rgba(212, 160, 23, 0.15)"
        }}>
          <div className="modal-header-left">
            <h2 style={{ 
              fontFamily: "'Bebas Neue', sans-serif", 
              fontSize: "2.4rem", 
              color: "white", 
              margin: 0,
              letterSpacing: "1px"
            }}>
              Artist Profile
            </h2>
          </div>
          <button 
            className="close-modal-btn" 
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#ccc" }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content" style={{ 
          padding: "2.4rem", 
          textAlign: "center" 
        }}>
          
          {/* Profile Image */}
          <div style={{ marginBottom: "1.8rem" }}>
            <img 
              src={artist.image} 
              alt={artist.name} 
              style={{ 
                width: "170px", 
                height: "170px", 
                borderRadius: "50%", 
                objectFit: "cover", 
                border: "5px solid var(--gold)",
                boxShadow: "0 10px 30px rgba(212, 160, 23, 0.25)"
              }} 
            />
          </div>

          {/* Artist Name */}
          <h2 style={{ 
            color: "white", 
            fontSize: "2rem", 
            margin: "0 0 1.5rem 0",
            fontFamily: "'Bebas Neue', sans-serif"
          }}>
            {artist.name}
          </h2>

          {/* Details Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.2rem",
            textAlign: "left",
            background: "rgba(0, 0, 0, 0.3)",
            padding: "1.6rem",
            borderRadius: "16px",
            border: "1px solid rgba(212, 160, 23, 0.15)"
          }}>
            
            <div>
              <p style={{ color: "#aaa", margin: "0 0 4px 0", fontSize: "0.9rem" }}>Total Streams</p>
              <p style={{ color: "white", fontSize: "1.35rem", fontWeight: "600" }}>{artist.streams}</p>
            </div>

            <div>
              <p style={{ color: "#aaa", margin: "0 0 4px 0", fontSize: "0.9rem" }}>Total Songs</p>
              <p style={{ color: "white", fontSize: "1.35rem", fontWeight: "600" }}>{artist.songs}</p>
            </div>

            <div>
              <p style={{ color: "#aaa", margin: "0 0 4px 0", fontSize: "0.9rem" }}>Joined</p>
              <p style={{ color: "white", fontSize: "1.1rem" }}>{artist.joined}</p>
            </div>

            <div>
              <p style={{ color: "#aaa", margin: "0 0 4px 0", fontSize: "0.9rem" }}>Status</p>
              <span className={`status-badge ${artist.status}`} style={{
                padding: "8px 18px",
                fontSize: "0.95rem"
              }}>
                {artist.status === 'verified' ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}