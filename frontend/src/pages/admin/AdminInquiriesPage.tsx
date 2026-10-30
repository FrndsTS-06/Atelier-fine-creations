import React, { useState, useEffect, useCallback } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { Inquiry, InquiryStatus } from '../../types/inquiry';
import { LoadingState } from '../../components/common/LoadingState';
import { MailIcon, PhoneIcon, SearchIcon } from '../../assets/icons';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inquiryService.getInquiries(filter !== 'ALL' ? filter : undefined);
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve client inquiries from atelier database.');
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    setUpdatingId(id);
    try {
      await inquiryService.updateStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch (err: any) {
      alert(`Update status error: ${err.message || 'Failed to update status'}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusColors: Record<InquiryStatus, { bg: string; text: string }> = {
    PENDING: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
    CONTACTED: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
    SCHEDULED: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
    CLOSED: { bg: 'rgba(156, 163, 175, 0.15)', text: '#9ca3af' },
  };

  // Search filter
  const filteredInquiries = inquiries.filter((inq) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = (inq.fullName || inq.name || '').toLowerCase().includes(term);
    const emailMatch = (inq.email || '').toLowerCase().includes(term);
    const subjectMatch = (inq.subject || '').toLowerCase().includes(term);
    const messageMatch = (inq.message || '').toLowerCase().includes(term);
    return nameMatch || emailMatch || subjectMatch || messageMatch;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>Private Client Inquiries</h1>
          <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.85rem' }}>
            VIP salon viewing requests, bespoke karat customization quotes, and concierge notes.
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'CONTACTED', 'SCHEDULED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid',
                borderColor: filter === st ? 'var(--color-gold-primary)' : 'var(--color-obsidian-border)',
                backgroundColor: filter === st ? 'var(--color-gold-glow)' : 'transparent',
                color: filter === st ? 'var(--color-gold-light)' : 'var(--color-champagne-muted)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.75rem', maxWidth: '420px', position: 'relative' }}>
        <SearchIcon
          width="16"
          height="16"
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-champagne-muted)',
          }}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Search by client name, email, subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.4rem' }}
        />
      </div>

      {loading ? (
        <LoadingState message="Fetching Concierge Dossiers..." />
      ) : error ? (
        <div
          className="atelier-card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#0c0d12',
            border: '1px solid rgba(239, 68, 68, 0.4)',
          }}
        >
          <p style={{ color: '#f87171', marginBottom: '1rem', fontSize: '0.95rem' }}>{error}</p>
          <button
            onClick={() => fetchInquiries()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-gold-primary)',
              background: 'transparent',
              color: 'var(--color-gold-primary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Retry Connection
          </button>
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div className="atelier-card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#0c0d12' }}>
          <p style={{ color: 'var(--color-champagne-muted)' }}>
            {searchTerm
              ? `No inquiries match "${searchTerm}".`
              : 'No client inquiries currently under this category.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredInquiries.map((inq) => {
            const clientName = inq.fullName || inq.name || 'Valued Client';
            const colors = statusColors[inq.status] || { bg: 'rgba(255,255,255,0.1)', text: '#ffffff' };

            return (
              <div
                key={inq.id}
                className="atelier-card"
                style={{
                  padding: '2rem',
                  backgroundColor: '#0c0d12',
                  borderLeft: inq.status === 'PENDING' ? '4px solid #f59e0b' : '4px solid var(--color-obsidian-border)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--color-champagne)', marginBottom: '0.25rem' }}>
                      {clientName}
                    </h3>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--color-champagne-muted)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MailIcon width="14" height="14" /> {inq.email}
                      </span>
                      {inq.phone && inq.phone !== 'N/A' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <PhoneIcon width="14" height="14" /> {inq.phone}
                        </span>
                      )}
                      {inq.preferredKarat && (
                        <span style={{ color: 'var(--color-gold-primary)' }}>
                          Preferred: {inq.preferredKarat}
                        </span>
                      )}
                      <span style={{ color: 'var(--color-champagne-muted)' }}>
                        Received: {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-champagne-muted)' }}>Status:</span>
                    <select
                      className="form-select"
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.75rem',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.text,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>
                </div>

                {inq.subject && (
                  <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--color-gold-light)', fontWeight: 600 }}>
                    Subject: {inq.subject}
                  </div>
                )}

                {inq.product && (
                  <div
                    style={{
                      marginBottom: '1rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--color-obsidian-subtle)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      display: 'inline-block',
                    }}
                  >
                    Interest in Masterpiece:{' '}
                    <strong style={{ color: 'var(--color-gold-light)' }}>{inq.product.name}</strong>
                  </div>
                )}

                <p
                  style={{
                    color: 'var(--color-champagne)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    backgroundColor: '#07080a',
                    padding: '1rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-obsidian-border)',
                    margin: '0.5rem 0',
                  }}
                >
                  "{inq.message}"
                </p>

                {inq.internalNotes && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-gold-antique)' }}>
                    <strong>Concierge Note:</strong> {inq.internalNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
