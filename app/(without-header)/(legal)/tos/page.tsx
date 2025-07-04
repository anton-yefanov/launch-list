// export const metadata = getSEOTags({
//   title: `Terms and Conditions | ${config.appName}`,
//   canonicalUrlRelative: "/tos",
// });

export default function TosPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold pb-8">
        Terms & Services of Launch List
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
        . By accessing or using our services, you agree to be bound by these
        Terms & Services.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">
        1. Description of Service
      </h2>
      <p>
        Launch List provides users with AI-driven analysis of user feedback and
        displays insights via an accessible dashboard.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">
        2. Subscription and Refund Policy
      </h2>
      <p>
        When purchasing a subscription plan, you gain access to various
        interactive features of Launch List. If you are not satisfied with our
        service, you may request a full refund within seven (7) days of your
        purchase by contacting us at{" "}
        <a
          href="mailto:official@launch-list.org"
          className="text-blue-500 hover:underline"
        >
          official@launch-list.org
        </a>
        .
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">
        3. User Data Collection
      </h2>
      <p className="pb-2">
        To provide our services, we collect the following personal data:
      </p>
      <ul className="list-disc pl-6 pb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Payment information</li>
      </ul>
      <p>
        We also collect non-personal data through web cookies to enhance your
        user experience. For detailed information regarding data collection,
        usage, and protection, please refer to our Privacy Policy at:{" "}
        <a
          href="https://launch-list.org/privacy-policy"
          className="text-blue-500 hover:underline"
        >
          https://launch-list.org/privacy-policy
        </a>
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">
        4. User Responsibilities
      </h2>
      <p>
        You agree to use Launch List in compliance with applicable laws and
        regulations and are responsible for safeguarding your account
        credentials.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">
        5. Ownership and Intellectual Property
      </h2>
      <p>
        Launch List owns all rights, title, and interest in and to the website,
        services, software, and content provided, excluding user-generated
        content.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">6. Updates to Terms</h2>
      <p>
        We may update these Terms & Services periodically. Users will be
        informed of any updates via email. Continued use of our services
        following notification constitutes acceptance of the updated terms.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">7. Governing Law</h2>
      <p>
        These Terms & Services shall be governed and interpreted under the laws
        of Ukraine.
      </p>
      <h2 className="font-semibold text-xl pt-6 pb-3">8. Contact Us</h2>
      <p>
        For any questions or concerns regarding these Terms & Services, please
        contact us at{" "}
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
