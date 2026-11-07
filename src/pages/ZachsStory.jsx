import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Field from '../components/Field.jsx';
import PageHero from '../components/PageHero.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { publicUrl } from '../lib/publicUrl.js';
import { sendForm } from '../lib/sendForm.js';

const emptyMemory = { name: '', email: '', memory: '', share: false, company: '' };

const rememberedQuotes = [
  'He lit up every room he entered',
  'I wouldn’t be the person I am today without Zach',
  'One of the best people I have ever met in my life',
  'The guy who would chew me out for not going out',
  'He was the guy who would make me laugh even when I was trying my hardest not to',
  'He had an impact on me like no other',
  'He was my favorite neighborhood kid, always so polite and friendly',
  'Zach was always looking for a loophole',
  'A wonderful boy, kind, fun, hilarious, and a dear friend to my son',
  'He left joy with everyone he met',
  'I love how cheerful and passionate he was',
  'I’ll never meet anyone like Zach the rest of my life, I’m forever grateful he came into my life',
  'He was the most perfect person and one of my favorites I have ever met',
  'Zach embodies the person all parents wish for. He was funny, kind, outgoing, and knew how to make good out of every bad',
  'He was such a special person who brought so much light to the lives of others',
  'His presence made a difference, and the love and memories he leaves behind will stay with us always',
];

const obituary = [
  'Zachary David Thomas Waltman, 22, was an amazing, beautiful bright light whose zest for life, kindness, warmth, and extraordinary sociability touched countless lives. Zach didn’t know a stranger. He had an incredible ability to make people feel welcome, included, and as if they had known him forever. He lit up every room he entered with his smile, his energy, and his genuine love for others.',
  'Zach was deeply loved by his family and knew that he was beloved. He was an extraordinary son and adored younger brother by his three sisters. He was cherished and adored by so many, and his family and friends will carry his beautiful spirit with them always. Zach loved all of his family and friends and wanted everyone to know how much he appreciated the love and support.',
  'Zach grew up in Wilmette, Illinois, where he attended Saint Francis Xavier School and Loyola Academy. He loved being a Rambler and cherished his years there, especially his time playing hockey. Zach excelled on the ice, in school, at work, and in so many other areas of his life. He was a loyal and enthusiastic teammate, avid sports fan, and passionate about physical fitness.',
  'He went on to Michigan State University, where he majored in finance and was immensely proud to be a Spartan and a brother of the Phi Gamma Delta (FIJI) fraternity. He embraced college life, his friendships, and every opportunity to experience life to the absolute fullest. He had an incredible experience studying abroad in Porto, Portugal this past Spring, where he was able to travel extensively and gather even more friends. He absolutely loved the opportunity to intern at Morgan Stanley the past two summers and was enthusiastic about a career in finance. Networking and socializing were his specialty.',
  'Zach is survived by his mother, Angela Thomas-Santos (Jeff Santos); his father, Chris Waltman (Katie Thomas); his sisters, Caroline, Colleen and Christina; and his stepbrothers, John (Jenna), Justin (Rachel), Joey, Christian and Ryder. He is also survived by numerous aunts, uncles, cousins, and countless friends who loved him dearly. Zach is preceded in death by his grandparents, William and Marjorie Thomas, David and Carol Waltman and aunt Susan Curry.',
];

const photos = [
  { src: 'Images/linkedin.jpg', alt: 'Zach in a suit and tie', aspect: 'aspect-[3/4] object-[center_62%]' },
  { src: 'Images/portrait.jpg', alt: 'Zach in a brown sweater', aspect: 'aspect-[3/4] object-center' },
  { src: 'Images/suit.jpg', alt: 'Zach jumping in a white tuxedo at a celebration', aspect: 'aspect-[3/4] object-top' },
  { src: 'Images/Hockey.jpg', alt: 'Zach as a boy in a Wilmette hockey jersey', aspect: 'aspect-[3/4] object-top' },
  { src: 'Images/family1.jpg', alt: 'Zach with his family at a graduation', aspect: 'aspect-[4/3] object-center col-span-2 lg:col-span-2' },
  { src: 'Images/family2.jpg', alt: 'Zach with his family by the ocean', aspect: 'aspect-[4/3] object-center col-span-2 lg:col-span-2' },
  { src: 'Images/friends.jpg', alt: 'Zach with a group of friends outside a house', aspect: 'aspect-[4/3] object-center col-span-2 lg:col-span-2' },
  { src: 'Images/hockey(old).jpg', alt: 'Zach with his Loyola Academy hockey team, wearing number 84', aspect: 'aspect-[3/2] object-center col-span-2 lg:col-span-2' },
];

export default function ZachsStory() {
  usePageTitle("Zach's Story");
  const [memory, setMemory] = useState(emptyMemory);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setMemory((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = {};
    if (memory.name.trim().length < 2) next.name = 'Please add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memory.email)) next.email = 'Enter a valid email.';
    if (memory.memory.trim().length < 20) next.memory = 'A memory needs at least a sentence.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await sendForm({
        form: 'memory',
        name: memory.name,
        email: memory.email,
        memory: memory.memory,
        share: memory.share,
        company: memory.company,
      });
      setSaved(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero title="Zach’s Story" />

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl space-y-5 leading-relaxed text-evergreen-800">
          {obituary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            Zach died following a brief battle with acute severe depression. While his family grieves this unimaginable loss, they want his life to be remembered not by how it ended, but by how he lived: with tremendous love, joy, friendship, generosity, and enthusiasm for life. Even in his passing, his generous spirit continued to touch others through his decision to be an organ donor with{' '}
            <a
              className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2"
              href="https://www.donors1.org"
              target="_blank"
              rel="noreferrer"
            >
              Gift of Life
            </a>
            , as well as donating to the Boston University CTE Center &amp; UNITE Brain Bank, giving others the opportunity for renewed life and the opportunity of leaving a lasting legacy that will continue to help others and advance research for generations to come.
          </p>
          <p>
            Zach was loved ferociously, unconditionally, and eternally. His light will never stop shining in the lives of all who had the privilege of knowing him.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="font-display text-3xl font-semibold">Photographs</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {photos.map((photo) => (
              <img
                key={photo.src}
                src={publicUrl(photo.src)}
                alt={photo.alt}
                width={1200}
                height={1500}
                className={`${photo.aspect} w-full rounded-3xl object-cover shadow-card`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="font-display text-3xl font-semibold">From people who knew him</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {rememberedQuotes.map((quote) => (
            <figure key={quote} className="card border-l-4 border-l-evergreen-800 p-5">
              <blockquote className="leading-relaxed text-evergreen-950">“{quote}”</blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold">Share a memory</h2>
              <p className="mt-3 leading-relaxed text-evergreen-800">
                If you have any memories you would like to share with Zach’s family, submit here.
              </p>
            </div>
            {saved ? (
              <div className="card flex flex-col items-start gap-3 p-8" role="status">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-800 text-white">
                  <Check className="h-6 w-6" />
                </span>
                <h3 className="font-display text-2xl font-semibold">Sent to the family</h3>
                <p className="text-sm leading-relaxed text-evergreen-800">
                  Thank you. Your memory was emailed to Zach’s family. It may take a little while to hear back.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setSaved(false);
                    setSubmitError('');
                    setMemory(emptyMemory);
                  }}
                >
                  Write another
                </button>
              </div>
            ) : (
              <form className="card relative space-y-4 p-6 sm:p-8" onSubmit={onSubmit} noValidate>
                <div className="absolute left-[-5000px]" aria-hidden="true">
                  <label htmlFor="memory-company">Company</label>
                  <input id="memory-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={memory.company} onChange={update} />
                </div>
                <Field id="memory-name" label="Your name" error={errors.name}>
                  <input id="memory-name" name="name" className={`field-input ${errors.name ? 'field-input-error' : ''}`} value={memory.name} onChange={update} autoComplete="name" />
                </Field>
                <Field id="memory-email" label="Email" error={errors.email} hint="So the family can reply.">
                  <input id="memory-email" name="email" type="email" className={`field-input ${errors.email ? 'field-input-error' : ''}`} value={memory.email} onChange={update} autoComplete="email" />
                </Field>
                <Field id="memory-body" label="A memory" error={errors.memory}>
                  <textarea id="memory-body" name="memory" rows={5} className={`field-input ${errors.memory ? 'field-input-error' : ''}`} value={memory.memory} onChange={update} />
                </Field>
                <label className="flex items-start gap-3 text-sm text-evergreen-800">
                  <input type="checkbox" name="share" checked={memory.share} onChange={update} className="field-check" />
                  The family may share this on the site later, with my name. Leave this unchecked to keep it private.
                </label>
                {submitError ? <p className="text-sm text-red-800" role="alert">{submitError}</p> : null}
                <button type="submit" className="btn-primary disabled:opacity-60" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send to the family'}
                </button>
              </form>
            )}
          </div>
          <p className="mt-10 text-sm text-evergreen-700">
            The work that follows his story lives on the{' '}
            <Link className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2" to="/about">about page</Link>
            {' '}and the{' '}
            <Link className="font-semibold text-evergreen-900 underline decoration-evergreen-300 underline-offset-2" to="/donate">donate page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
