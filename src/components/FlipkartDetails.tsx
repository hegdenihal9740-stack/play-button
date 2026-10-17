import { ShoppingCart, Zap, Star, Tag, ShieldCheck, RotateCcw, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import steelJpg from '@/assets/watch-steel.jpg';
import blackJpg from '@/assets/watch-black.jpg';
import goldJpg from '@/assets/watch-gold.jpg';
import roseJpg from '@/assets/watch-rosegold.jpg';
import steelTry from '@/assets/try-on-steel.png';
import blackTry from '@/assets/try-on-black.png';
import goldTry from '@/assets/try-on-gold.png';
import roseTry from '@/assets/try-on-rosegold.png';
import steelHand from '@/assets/hand-steel.jpg';
import blackHand from '@/assets/hand-black.jpg';
import goldHand from '@/assets/hand-gold.jpg';
import roseHand from '@/assets/hand-rosegold.jpg';
const VID_PREFIX = 'spin:';
const isVid = (s?: string) => !!s && s.startsWith(VID_PREFIX);
const dialSizes = ['38 mm', '40 mm', '42 mm', '44 mm'];

const extra: Record<WatchTone, string[]> = {
  steel: [steelHand, steelJpg, steelTry], black: [blackHand, blackJpg, blackTry], gold: [goldHand, goldJpg, goldTry], rosegold: [roseHand, roseJpg, roseTry],
};
import { WatchScene } from '@/components/WatchScene';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cart, prices } from '@/lib/cart';
import { watches, type WatchTone } from '@/lib/watches';

const usd = (n: number) => n.toLocaleString('en-US');

export function FlipkartDetails({
  tone, open, onOpenChange, list, rating, reviews, specs,
}: { tone: WatchTone; open: boolean; onOpenChange: (o: boolean) => void; list: number; rating: number; reviews: number; specs: string[] }) {
  const w = watches.find((x) => x.id === tone)!;
  const price = prices[w.id];
  const anims = [`${VID_PREFIX}3d|${w.id}`];
  const imgs = [w.image, ...extra[w.id], ...anims];
  const [dial, setDial] = useState('42 mm');
  const [idx, setIdx] = useState(0);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState(false);
  const go = (d: number) => { setZoom(false); setIdx((i) => (i + d + imgs.length) % imgs.length); };
  const off = Math.round((1 - price / list) * 100);
  const table: [string, string][] = [
    ['Model Name', `Private Flight ${w.name}`],
    ['Dial Color', w.details[0]],
    ['Strap / Case Finish', w.finish],
    ['Dial Size', dial],
    ['Case Thickness', '11.5 mm'],
    ['Strap Width', '20 mm'],
    ['Water Resistance', '100 m'],
    ['Display Type', 'Analog'],
    ['Ideal For', 'Men'],
    ...specs.map((s, i) => [['Case Size', 'Feature', 'Movement'][i] ?? 'Feature', s] as [string, string]),
    ['Warranty', '2 Years manufacturer warranty'],
  ];
  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fk-panel">
        <div className="fk-grid">
          <div className="fk-left">
            <div className="fk-gallery">
              <div className="fk-thumbs">{imgs.map((src, i) => (
                <button type="button" key={src} className={`fk-thumb ${i === idx ? 'is-active' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => setIdx(i)}>{isVid(src) ? <span className="fk-thumb-vid">3D</span> : <img src={src} alt="" />}</button>
              ))}</div>
              {isVid(imgs[idx]) ? <div className="fk-imgbox"><div className="fk-3d" onClick={(e) => e.stopPropagation()}><WatchScene key={w.id} tone={w.id} interactive /></div></div> : <button type="button" className="fk-imgbox" onClick={() => setFull(true)} aria-label="Open full image view"><img src={imgs[idx]} alt={w.name} /><span className="fk-zoomhint"><ZoomIn size={14} /> Click to see full view</span></button>}
            </div>
            <div className="fk-actions">
              <button type="button" className="fk-cart" onClick={() => { cart.add(w.id); toast.success(`${w.name} (${dial}) added to cart`); }}><ShoppingCart size={18} /> ADD TO CART</button>
              <button type="button" className="fk-buy" onClick={() => { cart.add(w.id); toast.success('Proceeding to checkout'); onOpenChange(false); }}><Zap size={18} /> BUY NOW</button>
            </div>
          </div>
          <div className="fk-right">
            <p className="fk-brand">Private Flight</p>
            <DialogTitle className="fk-title">{w.name} {w.details[0]} {w.finish} Analog Watch - For Men</DialogTitle>
            <div className="fk-rating-row">
              <span className="fk-rating">{rating} <Star size={12} fill="currentColor" /></span>
              <span className="fk-muted">{usd(reviews * 3)} Ratings & {usd(reviews)} Reviews</span>
            </div>
            <p className="fk-special">Special price</p>
            <div className="fk-price-row">
              <span className="fk-price">${usd(price)}</span>
              <s className="fk-muted">${usd(list)}</s>
              <span className="fk-off">{off}% off</span>
            </div>
            <div className="fk-section">
              <h4>Dial Size</h4>
              <div className="fk-sizes">{dialSizes.map((d) => (
                <button type="button" key={d} className={`fk-size ${d === dial ? 'is-active' : ''}`} onClick={() => setDial(d)}>{d}</button>
              ))}</div>
            </div>
            <div className="fk-section">
              <h4>Available offers</h4>
              <ul className="fk-offers">
                <li><Tag size={14} /> <b>Bank Offer</b> 5% Unlimited Cashback on Credit Card</li>
                <li><Tag size={14} /> <b>Special Price</b> Get extra {off}% off (price inclusive of discount)</li>
                <li><Tag size={14} /> <b>Partner Offer</b> Free engraving on orders this week</li>
              </ul>
            </div>
            <div className="fk-perks">
              <span><Truck size={16} /> Free Delivery</span>
              <span><RotateCcw size={16} /> 7 Days Return</span>
              <span><ShieldCheck size={16} /> 2 Yr Warranty</span>
            </div>
            <div className="fk-section">
              <h4>Highlights</h4>
              <ul className="fk-highlights">{[...w.details, ...specs].map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
            <div className="fk-section">
              <h4>Description</h4>
              <DialogDescription className="fk-desc">{w.description}</DialogDescription>
            </div>
            <div className="fk-section">
              <h4>Specifications</h4>
              <table className="fk-table"><tbody>{table.map(([k, v]) => <tr key={k + v}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={full} onOpenChange={(o) => { setFull(o); setZoom(false); }}>
      <DialogContent className="fk-full">
        <DialogTitle className="sr-only">{w.name} full image view</DialogTitle>
        <div className="fk-full-main">
          <button type="button" className="fk-nav" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={28} /></button>
          <div className={`fk-full-stage ${zoom ? 'is-zoom' : ''}`} onClick={() => setZoom((z) => !z)}>{isVid(imgs[idx]) ? <div className="fk-3d" onClick={(e) => e.stopPropagation()}><WatchScene key={w.id} tone={w.id} interactive /></div> : <img src={imgs[idx]} alt={w.name} />}</div>
          <button type="button" className="fk-nav" onClick={() => go(1)} aria-label="Next image"><ChevronRight size={28} /></button>
        </div>
        <div className="fk-full-thumbs">{imgs.map((src, i) => (
          <button type="button" key={src} className={`fk-thumb ${i === idx ? 'is-active' : ''}`} onClick={() => { setIdx(i); setZoom(false); }}>{isVid(src) ? <span className="fk-thumb-vid">3D</span> : <img src={src} alt="" />}</button>
        ))}</div>
      </DialogContent>
    </Dialog>
    </>
  );
}
