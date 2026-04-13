import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyAPI, uploadAPI } from '../utils/api';
import styles from './PropertyForm.module.css';

const AMENITIES = ['Swimming Pool','Gym','Club House','Security','Power Backup','Lift','Garden','Children Play Area','Parking','Visitor Parking','CCTV','Intercom','Rain Water Harvesting','Solar Energy','Sewage Treatment','Fire Safety','Jogging Track','Badminton Court','Tennis Court','Indoor Games','Multipurpose Hall','Temple','School','Hospital Nearby','Market Nearby','Railway Station Nearby','Bus Stop Nearby','Highway Access','Water Supply 24/7'];

const INITIAL = {
  title:'', description:'', propertyType:'flat', listingType:'sale', status:'ready-to-move',
  price:'', priceUnit:'total', priceNegotiable:false,
  bhk:'N/A', furnishing:'N/A', facing:'N/A', parking:'N/A', age:'N/A',
  bathrooms:0, balconies:0,
  area:{ total:'', carpet:'', unit:'sqft' },
  floor:{ current:'', total:'' },
  location:{ address:'', locality:'', city:'Palghar', state:'Maharashtra', pincode:'401404', landmark:'' },
  amenities:[], images:[], isActive:true, isFeatured:false,
  contactPhone:'8975127927', contactWhatsapp:'8975127927',
  metaTitle:'', metaDescription:'',
  builderProject:{ name:'', builder:'', reraNumber:'', totalUnits:'', availableUnits:'' }
};

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState(INITIAL);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (isEdit) {
      // fetch property by id via admin list and find
      propertyAPI.getAll({limit:200}).then(res => {
        const found = res.data.data.find(p => p._id === id);
        if (found) {
          setForm({...INITIAL, ...found,
            price: found.price || '',
            area: { total: found.area?.total || '', carpet: found.area?.carpet || '', unit: found.area?.unit || 'sqft' },
            floor: { current: found.floor?.current || '', total: found.floor?.total || '' },
            location: { ...INITIAL.location, ...found.location },
            builderProject: { ...INITIAL.builderProject, ...found.builderProject }
          });
        }
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const set = (path, value) => {
    setForm(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      const res = await uploadAPI.images(fd);
      const newImages = res.data.data;
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages.map((img, i) => ({ ...img, isPrimary: prev.images.length === 0 && i === 0 }))]
      }));
    } catch (err) {
      setError('Image upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setForm(prev => {
      const images = prev.images.filter((_, i) => i !== index);
      if (images.length > 0 && !images.find(img => img.isPrimary)) images[0].isPrimary = true;
      return { ...prev, images };
    });
  };

  const setPrimary = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isPrimary: i === index }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.title || !form.description || !form.price || !form.location.address) {
      setError('Please fill in all required fields (Title, Description, Price, Address).');
      setActiveTab('basic');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bathrooms: Number(form.bathrooms),
        balconies: Number(form.balconies),
        area: { ...form.area, total: Number(form.area.total) || 0, carpet: Number(form.area.carpet) || 0 },
        floor: { current: Number(form.floor.current) || 0, total: Number(form.floor.total) || 0 },
      };
      if (isEdit) {
        await propertyAPI.update(id, payload);
        setSuccess('Property updated successfully!');
      } else {
        await propertyAPI.create(payload);
        setSuccess('Property created successfully!');
        setTimeout(() => navigate('/properties'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const TABS = ['basic', 'details', 'location', 'amenities', 'images', 'seo'];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Property' : 'Add New Property'}</div>
          <div className="page-subtitle">{isEdit ? `Editing: ${form.title}` : 'Fill in the property details below'}</div>
        </div>
        <button className="btn btn-outline" onClick={() => navigate('/properties')}>← Back</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}

      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── BASIC ── */}
        {activeTab === 'basic' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>
            <div className={styles.grid2}>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Property Title *</label>
                <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 2 BHK Premium Flat near Railway Station" required />
              </div>
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select className="form-input" value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                  {['flat','plot','commercial','rental','builder-project'].map(t => <option key={t} value={t}>{t.replace('-',' ')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Listing Type *</label>
                <select className="form-input" value={form.listingType} onChange={e => set('listingType', e.target.value)}>
                  <option value="sale">Sale</option><option value="rent">Rent</option><option value="lease">Lease</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input className="form-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 4500000" required />
              </div>
              <div className="form-group">
                <label className="form-label">Price Unit</label>
                <select className="form-input" value={form.priceUnit} onChange={e => set('priceUnit', e.target.value)}>
                  <option value="total">Total Price</option><option value="per-sqft">Per Sq.Ft.</option><option value="per-month">Per Month</option>
                </select>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label className="form-label">Description *</label>
                <textarea className="form-input" rows={5} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the property in detail..." required style={{resize:'vertical'}} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                  <option value="ready-to-move">Ready to Move</option><option value="under-construction">Under Construction</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">BHK Type</label>
                <select className="form-input" value={form.bhk} onChange={e => set('bhk', e.target.value)}>
                  {['N/A','1RK','1BHK','2BHK','3BHK','4BHK','5BHK','Studio'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className={styles.checkRow}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} />
                  Mark as Featured Property
                </label>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} />
                  Active (visible on website)
                </label>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={form.priceNegotiable} onChange={e => set('priceNegotiable', e.target.checked)} />
                  Price Negotiable
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── DETAILS ── */}
        {activeTab === 'details' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Property Details</h3>
            <div className={styles.grid3}>
              <div className="form-group"><label className="form-label">Total Area</label><input className="form-input" type="number" value={form.area.total} onChange={e => set('area.total', e.target.value)} placeholder="e.g. 850" /></div>
              <div className="form-group"><label className="form-label">Carpet Area</label><input className="form-input" type="number" value={form.area.carpet} onChange={e => set('area.carpet', e.target.value)} placeholder="e.g. 720" /></div>
              <div className="form-group"><label className="form-label">Area Unit</label><select className="form-input" value={form.area.unit} onChange={e => set('area.unit', e.target.value)}><option value="sqft">Sq.Ft.</option><option value="sqmt">Sq.Mt.</option><option value="guntha">Guntha</option><option value="acre">Acre</option></select></div>
              <div className="form-group"><label className="form-label">Floor No.</label><input className="form-input" type="number" value={form.floor.current} onChange={e => set('floor.current', e.target.value)} placeholder="3" /></div>
              <div className="form-group"><label className="form-label">Total Floors</label><input className="form-input" type="number" value={form.floor.total} onChange={e => set('floor.total', e.target.value)} placeholder="7" /></div>
              <div className="form-group"><label className="form-label">Facing</label><select className="form-input" value={form.facing} onChange={e => set('facing', e.target.value)}>{['N/A','East','West','North','South','North-East','North-West','South-East','South-West'].map(f=><option key={f} value={f}>{f}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Furnishing</label><select className="form-input" value={form.furnishing} onChange={e => set('furnishing', e.target.value)}>{['N/A','Furnished','Semi-Furnished','Unfurnished'].map(f=><option key={f} value={f}>{f}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Parking</label><select className="form-input" value={form.parking} onChange={e => set('parking', e.target.value)}>{['N/A','Covered','Open','Both','None'].map(p=><option key={p} value={p}>{p}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Age</label><select className="form-input" value={form.age} onChange={e => set('age', e.target.value)}>{['N/A','New Construction','Under 1 Year','1-5 Years','5-10 Years','10+ Years'].map(a=><option key={a} value={a}>{a}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Bathrooms</label><input className="form-input" type="number" min="0" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Balconies</label><input className="form-input" type="number" min="0" value={form.balconies} onChange={e => set('balconies', e.target.value)} /></div>
            </div>

            {form.propertyType === 'builder-project' && (
              <>
                <h3 className={styles.sectionTitle} style={{marginTop:24}}>Builder Project Details</h3>
                <div className={styles.grid3}>
                  <div className="form-group"><label className="form-label">Project Name</label><input className="form-input" value={form.builderProject.name} onChange={e => set('builderProject.name', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Builder Name</label><input className="form-input" value={form.builderProject.builder} onChange={e => set('builderProject.builder', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">RERA Number</label><input className="form-input" value={form.builderProject.reraNumber} onChange={e => set('builderProject.reraNumber', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Total Units</label><input className="form-input" type="number" value={form.builderProject.totalUnits} onChange={e => set('builderProject.totalUnits', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Available Units</label><input className="form-input" type="number" value={form.builderProject.availableUnits} onChange={e => set('builderProject.availableUnits', e.target.value)} /></div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── LOCATION ── */}
        {activeTab === 'location' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Location Details</h3>
            <div className={styles.grid2}>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Full Address *</label><input className="form-input" value={form.location.address} onChange={e => set('location.address', e.target.value)} placeholder="e.g. Near Isckon Temple, Ambedkar Road" required /></div>
              <div className="form-group"><label className="form-label">Locality *</label><input className="form-input" value={form.location.locality} onChange={e => set('location.locality', e.target.value)} placeholder="e.g. Palghar East" required /></div>
              <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.location.city} onChange={e => set('location.city', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.location.state} onChange={e => set('location.state', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" value={form.location.pincode} onChange={e => set('location.pincode', e.target.value)} maxLength={6} /></div>
              <div className="form-group" style={{gridColumn:'1/-1'}}><label className="form-label">Landmark</label><input className="form-input" value={form.location.landmark} onChange={e => set('location.landmark', e.target.value)} placeholder="e.g. Near Railway Station" /></div>
            </div>
          </div>
        )}

        {/* ── AMENITIES ── */}
        {activeTab === 'amenities' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Amenities ({form.amenities.length} selected)</h3>
            <div className={styles.amenitiesGrid}>
              {AMENITIES.map(a => (
                <label key={a} className={`${styles.amenityChk} ${form.amenities.includes(a) ? styles.amenitySelected : ''}`}>
                  <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} style={{display:'none'}} />
                  <span>{form.amenities.includes(a) ? '✓' : '+'}</span> {a}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* ── IMAGES ── */}
        {activeTab === 'images' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>Property Images ({form.images.length} uploaded)</h3>
            <div
              className={styles.uploadZone}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleImageUpload({ target: { files: e.dataTransfer.files } }); }}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
              {uploading ? (
                <><span className="spinner-dark spinner-lg"></span><p>Uploading...</p></>
              ) : (
                <><div className={styles.uploadIcon}>📷</div><p><strong>Click to upload</strong> or drag & drop images</p><p className={styles.uploadHint}>JPG, PNG, WebP — Max 5MB each, up to 10 images</p></>
              )}
            </div>
            {form.images.length > 0 && (
              <div className={styles.imageGrid}>
                {form.images.map((img, i) => (
                  <div key={i} className={`${styles.imageTile} ${img.isPrimary ? styles.imagePrimary : ''}`}>
                    <img src={img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`} alt={`Property ${i+1}`} />
                    <div className={styles.imageActions}>
                      {!img.isPrimary && <button type="button" onClick={() => setPrimary(i)} title="Set as primary">⭐</button>}
                      <button type="button" onClick={() => removeImage(i)} title="Remove" style={{background:'rgba(229,62,62,0.85)'}}>✕</button>
                    </div>
                    {img.isPrimary && <div className={styles.primaryBadge}>Primary</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SEO ── */}
        {activeTab === 'seo' && (
          <div className={`card ${styles.section}`}>
            <h3 className={styles.sectionTitle}>SEO Settings</h3>
            <div className="form-group"><label className="form-label">Meta Title (60 chars max)</label><input className="form-input" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="e.g. 2 BHK Flat in Palghar | Bhagat Estates" maxLength={60} /><small style={{color:'var(--text-muted)'}}>Leave blank to auto-generate</small></div>
            <div className="form-group"><label className="form-label">Meta Description (160 chars max)</label><textarea className="form-input" rows={3} value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="Brief description for search engines..." maxLength={160} style={{resize:'vertical'}} /></div>
            <div className={styles.grid2}>
              <div className="form-group"><label className="form-label">Contact Phone</label><input className="form-input" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">WhatsApp Number</label><input className="form-input" value={form.contactWhatsapp} onChange={e => set('contactWhatsapp', e.target.value)} /></div>
            </div>
          </div>
        )}

        <div className={styles.formFooter}>
          <button type="button" className="btn btn-outline" onClick={() => navigate('/properties')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <><span className="spinner"></span> Saving...</> : isEdit ? '✓ Update Property' : '+ Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
