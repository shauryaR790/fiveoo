import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | FIVEO",
  description:
    "How FIVEO collects, uses, and protects personal information across our website, chat, and messaging services.",
};

const UPDATED = "November 14, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main
      id="main"
      className="min-h-svh bg-black px-5 pb-20 pt-10 text-white md:px-10 md:pb-28 md:pt-14 lg:px-16"
    >
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium tracking-[-0.02em] text-white/70 transition-opacity hover:text-white hover:opacity-100"
        >
          ← Back to FIVEO
        </Link>

        <h1 className="font-display mt-10 text-[clamp(2.25rem,6vw,4rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
          Privacy Policy
        </h1>
        <p className="mt-4 text-[15px] font-light leading-relaxed text-white/65 md:text-[16px]">
          Last updated: {UPDATED}
        </p>

        <div className="mt-12 space-y-10 font-[family-name:var(--font-card)] text-[16px] font-light leading-[1.7] text-white/85 md:text-[17px]">
          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              1. Who we are
            </h2>
            <p>
              FIVEO (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a
              creative studio that provides branding, UI/UX, motion, and related
              design services. This Privacy Policy explains how we collect, use,
              disclose, and protect personal information when you use our
              website, contact us, or communicate with us through messaging
              channels such as WhatsApp or Meta platforms.
            </p>
            <p>
              Contact:{" "}
              <a
                href={CONTACT_MAILTO}
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              2. Information we collect
            </h2>
            <p>We may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Contact details you share with us, such as name, email address,
                phone number, and business name.
              </li>
              <li>
                Project and inquiry details you send by email, website forms,
                chat, or messaging apps.
              </li>
              <li>
                Message content and metadata when you communicate with us on
                WhatsApp or other Meta messaging products (for example phone
                number, timestamps, and delivery status).
              </li>
              <li>
                Technical data such as IP address, browser type, device type,
                pages visited, and approximate location derived from IP, when
                you use our website.
              </li>
              <li>
                Cookies or similar technologies used for basic site function,
                analytics, and preferences (such as theme).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              3. How we use information
            </h2>
            <p>We use personal information to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to inquiries and provide our design services.</li>
              <li>
                Operate, maintain, and improve our website, chat assistant, and
                customer communications.
              </li>
              <li>
                Send service-related messages, including replies and project
                updates, including via WhatsApp where you have messaged us or
                opted in.
              </li>
              <li>Comply with legal obligations and protect our rights.</li>
              <li>
                Understand how the site is used so we can improve performance
                and content.
              </li>
            </ul>
            <p>
              We do not sell your personal information. We do not use WhatsApp
              or Meta messaging data to train unrelated public AI models or for
              advertising to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              4. Messaging and Meta platforms
            </h2>
            <p>
              If you contact us through WhatsApp Business or other Meta
              messaging tools, we process the information needed to receive,
              manage, and reply to those conversations. That may include your
              phone number, profile name, message content, and related delivery
              data provided by Meta.
            </p>
            <p>
              Message data is used only to communicate with you about your
              request or engagement with FIVEO, to keep records of the
              conversation as needed for service delivery, and to meet legal or
              security requirements. Access is limited to people on our team
              who need it to help you.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              5. Sharing of information
            </h2>
            <p>We may share information with:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Service providers who help us run our website, email, hosting,
                analytics, or messaging infrastructure (for example hosting and
                Meta/WhatsApp as the messaging platform).
              </li>
              <li>
                Professional advisors or authorities when required by law or to
                protect rights, safety, and security.
              </li>
              <li>
                A successor entity if we are involved in a merger, acquisition,
                or asset transfer, subject to this policy or equivalent
                protection.
              </li>
            </ul>
            <p>
              These parties are expected to use personal information only as
              needed to perform their services for us or as required by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              6. Data retention
            </h2>
            <p>
              We keep personal information only as long as needed for the
              purposes described above, including project delivery, customer
              support, legal compliance, and dispute resolution. Messaging
              records may be retained for a reasonable period to maintain
              conversation context and business records, then deleted or
              anonymized when no longer needed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              7. Security
            </h2>
            <p>
              We use reasonable technical and organizational measures to protect
              personal information against unauthorized access, loss, misuse, or
              alteration. No method of transmission or storage is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              8. Your choices and rights
            </h2>
            <p>
              Depending on where you live, you may have rights to access,
              correct, delete, or restrict use of your personal information, or
              to object to certain processing. To make a request, email{" "}
              <a
                href={CONTACT_MAILTO}
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {CONTACT_EMAIL}
              </a>
              . You can also stop messaging us on WhatsApp at any time, or ask
              us to delete conversation records we control where applicable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              9. Children
            </h2>
            <p>
              Our services are directed to businesses and adults. We do not
              knowingly collect personal information from children under 13 (or
              the age required by local law). If you believe a child has
              provided us information, contact us and we will take appropriate
              steps to delete it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              10. International transfers
            </h2>
            <p>
              We may process information on servers or with providers located
              outside your country. Where we do, we take steps designed to
              protect the information in line with this policy and applicable
              law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              11. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The
              &quot;Last updated&quot; date at the top will change when we do.
              Continued use of our site or messaging services after an update
              means you acknowledge the revised policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-[1.35rem] font-semibold uppercase tracking-[-0.02em] text-white md:text-[1.5rem]">
              12. Contact
            </h2>
            <p>
              Questions about this Privacy Policy or your data:
              <br />
              FIVEO
              <br />
              Email:{" "}
              <a
                href={CONTACT_MAILTO}
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
