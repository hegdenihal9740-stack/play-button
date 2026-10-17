import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { FlipkartDetails } from './FlipkartDetails';
import { ScanLine, Star } from 'lucide-react';
import { toast } from 'sonner';
import { cart, prices } from '@/lib/cart';
import { watches, type WatchTone } from '@/lib/watches';

const meta: Record<WatchTone, { list: number; rating: number; reviews: number; bought: string; badge?: string; stock?: number; specs: string[] }> = {
  steel: { list: 14900, rating: 4.7, reviews: 1842, bought: '500+', badge: 'Best Seller', specs: ['41mm case', '200m water resistant', 'Automatic movement'] },
  black: { list: 16900, rating: 4.6, reviews: 963, bought: '200+', badge: 'Limited time deal', stock: 3, specs: ['42mm case', 'Sapphire crystal', 'Skeleton dial'] },
  gold: { list: 21500, rating: 4.8, reviews: 1204, bought: '300+', badge: 'Overall Pick', specs: ['40mm case', 'Chronograph', '100m water resistant'] },
  rosegold: { list: 18900, rating: 4.5, reviews: 712, bought: '100+', stock: 5, specs: ['38mm case', 'Leather strap', 'Quartz movement'] },
};

const usd = (n: number) => n.toLocaleString('en-US');

function Stars({ value }: { value: number }) {
  return (
    <span className="az-stars" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="az-star">
            <Star size={15} className="az-star-bg" />
            <span style={{ width: `${fill * 100}%` }}><Star size={15} fill="currentColor" /></span>
          </span>
        );
      })}
    </span>
  );
}

export function WatchProductCard({ tone }: { tone: WatchTone }) {
  const w = watches.find((x) => x.id === tone);
  if (!w) return null;
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const [more, setMore] = useState(false);
  const m = meta[w.id];
  const price = prices[w.id];
  const off = Math.round((1 - price / m.list) * 100);
  return (
    <article className="az-card">
      {m.badge && <span className="az-badge">{m.badge}</span>}
      <Link to="/watches/$watchId" params={{ watchId: w.id }} className="az-img"><img src={w.image} alt={w.name} loading="lazy" /></Link>
      <div className="az-body">
        <p className="az-eyebrow">Private Flight · {w.finish}</p>
        <Link to="/watches/$watchId" params={{ watchId: w.id }} className="az-title">{w.name}</Link>
        <p className="az-specs">{m.specs.join(' · ')}</p>
        <div className="az-price-row">
          <span className="az-price">${usd(price)}</span>
          <s className="az-muted">${usd(m.list)}</s>
          <span className="az-off">−{off}%</span>
        </div>
        <div className="az-rating"><Stars value={m.rating} /><span>{m.rating}</span><span className="az-muted">({usd(m.reviews)})</span></div>
        <p className="az-small az-muted">Delivered by {tomorrow}{m.stock ? ` · only ${m.stock} left` : ''}</p>
        <button type="button" className="az-add" onClick={() => { cart.add(w.id); toast.success(`${w.name} added to cart`); }}>Add to bag</button>
        <div className="az-links">
          <Link to="/watches/$watchId" params={{ watchId: w.id }} search={{ tryon: true }} className="az-tryon"><ScanLine size={14} /> Try on</Link>
          <button type="button" className="az-more" onClick={() => setMore(true)}>Details</button>
        </div>
        <FlipkartDetails tone={w.id} open={more} onOpenChange={setMore} list={m.list} rating={m.rating} reviews={m.reviews} specs={m.specs} />
      </div>
    </article>
  );
}

export function AmazonWatchCards() {
  return (
    <section className="az-section" aria-labelledby="az-title">
      <h2 id="az-title">Shop the collection</h2>
      <div className="az-grid">
        {watches.map((w) => <WatchProductCard key={w.id} tone={w.id} />)}
      </div>
    </section>
  );
}
