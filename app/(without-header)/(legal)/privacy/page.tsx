// export const metadata = getSEOTags({
//   title: `Privacy Policy | ${config.appName}`,
//   canonicalUrlRelative: "/privacy-policy",
// });

export default function PrivacyPolicyPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold pb-8">
        Privacy Policy of Launch List
      </h1>

      <p className="pb-6">
        <strong>Effective Date:</strong> April 10, 2025
      </p>

      <p className="pb-6">
        Welcome to <strong>Launch List</strong>, accessible at{" "}
        <a
          href="https://launch-list.org"
          className="text-blue-500 hover:underline"
        >
          https://launch-list.org
        </a>
        . Your privacy is important to us. This Privacy Policy explains how we
        collect, use, and protect your data.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">1. Data We Collect</h2>
      <p className="pb-2">We collect the following personal information:</p>
      <ul className="list-disc pl-6 pb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Payment information</li>
      </ul>

      <p>
        Additionally, we collect non-personal data through web cookies to
        enhance your user experience.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">
        2. How We Use Your Data
      </h2>
      <p>
        We use the data we collect solely to better understand our clients and
        improve the quality of our services, specifically to provide accurate
        AI-driven analysis and insights.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">3. Data Sharing</h2>
      <p>
        Launch List does not share, sell, rent, or otherwise distribute your
        personal information to third parties.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">
        4. Children&#39;s Privacy
      </h2>
      <p>
        Our services are not intended for children. We do not knowingly collect
        or store any data from children under the age of 18.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">
        5. Updates to Privacy Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. Users will be
        informed of any significant changes via email. Continued use of our
        services after notification indicates your acceptance of the updated
        Privacy Policy.
      </p>

      <h2 className="font-semibold text-xl pt-6 pb-3">6. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our data
        practices, please contact us at{" "}
        <a
          href="mailto:official@launch-list.org"
          className="text-blue-500 hover:underline"
        >
          official@launch-list.org
        </a>
        .
      </p>
    </div>
  );
}
