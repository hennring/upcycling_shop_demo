import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { NewsletterForm } from './NewsletterForm';
import { LoadingNotice } from '../../components/LoadingNotice';

/** Anchor target of the header/footer link and of the return path after login. */
export const NEWSLETTER_ANCHOR = 'werkstattbrief';

export function NewsletterSection() {
  const { user, loading } = useAuth();

  return (
    <section id={NEWSLETTER_ANCHOR} className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-rust uppercase">Werkstattbrief</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-stone-900 md:text-4xl">
            Das Werkstatttagebuch ins Postfach
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-stone-600">
            <p>
              Alle zwei Wochen ein Brief: was angekommen ist, was daraus wird, welches Stück gerade
              fertig auf der Werkbank liegt. Kein Rabattcode-Newsletter.
            </p>
            <p className="text-base text-stone-500">
              Abmelden geht jederzeit über den Link am Ende jeder Mail – ohne Anmeldung, ohne
              Rückfrage.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-8 lg:mt-4">
          {loading && <LoadingNotice />}

          {/* Signing up is tied to the account, so the address is never typed in here */}
          {!loading && !user && (
            <>
              <h3 className="font-display text-xl font-semibold text-stone-900">
                Anmelden und abonnieren
              </h3>
              <p className="mt-3 leading-relaxed text-stone-600">
                Den Werkstattbrief verschicken wir an die Adresse Ihres Kontos. Melden Sie sich an
                oder legen Sie ein Konto an – danach genügt ein Klick.
              </p>
              <Link
                to="/login"
                state={{ returnTo: `/#${NEWSLETTER_ANCHOR}` }}
                className="mt-6 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-700"
              >
                Anmelden
              </Link>
            </>
          )}

          {!loading && user && <NewsletterForm email={user.email} />}
        </div>
      </div>
    </section>
  );
}
