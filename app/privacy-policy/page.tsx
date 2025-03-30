"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8 px-4 md:px-6">
        <div className="mb-6">
          <Link href="/" passHref>
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated March 30, 2025</p>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>1. WHAT INFORMATION DO WE COLLECT?</h2>
          <h3>Personal information you disclose to us</h3>
          <p>
            <em>
              <strong>In Short:</strong> We collect personal information that you provide to us.
            </em>
          </p>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services,
            express an interest in obtaining information about us or our products and Services, when you participate in
            activities on the Services, or otherwise when you contact us.
          </p>
          <p>
            <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on
            the context of your interactions with us and the Services, the choices you make, and the products and
            features you use. The personal information we collect may include the following:
          </p>
          <ul>
            <li>names</li>
            <li>email addresses</li>
            <li>passwords</li>
            <li>usernames</li>
            <li>contact preferences</li>
          </ul>
          <p>
            <strong>Sensitive Information.</strong> We do not process sensitive information.
          </p>
          <p>
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us
            of any changes to such personal information.
          </p>

          <h2>2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p>
            <em>
              <strong>In Short:</strong> We process your information to provide, improve, and administer our Services,
              communicate with you, for security and fraud prevention, and to comply with law. We may also process your
              information for other purposes with your consent.
            </em>
          </p>
          <p>
            <strong>
              We process your personal information for a variety of reasons, depending on how you interact with our
              Services, including:
            </strong>
          </p>
          <ul>
            <li>
              <strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We
              may process your information so you can create and log in to your account, as well as keep your account in
              working order.
            </li>
          </ul>

          <h2>3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
          <p>
            <em>
              <strong>In Short:</strong> We may share information in specific situations described in this section
              and/or with the following third parties.
            </em>
          </p>
          <p>We may need to share your personal information in the following situations:</p>
          <ul>
            <li>
              <strong>Business Transfers.</strong> We may share or transfer your information in connection with, or
              during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion
              of our business to another company.
            </li>
          </ul>

          <h2>4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
          <p>
            <em>
              <strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence,
              machine learning, or similar technologies.
            </em>
          </p>
          <p>
            As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine
            learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your
            experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of
            the AI Products within our Services.
          </p>

          <h3>Use of AI Technologies</h3>
          <p>
            We provide the AI Products through third-party service providers ("AI Service Providers"), including 01.AI.
            As outlined in this Privacy Notice, your input, output, and personal information will be shared with and
            processed by these AI Service Providers to enable your use of our AI Products for purposes outlined in "WHEN
            AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?" You must not use the AI Products in any way that
            violates the terms or policies of any AI Service Provider.
          </p>

          <h3>Our AI Products</h3>
          <p>Our AI Products are designed for the following functions:</p>
          <ul>
            <li>Text analysis</li>
            <li>Natural language processing</li>
          </ul>

          <h3>How We Process Your Data Using AI</h3>
          <p>
            All personal information processed using our AI Products is handled in line with our Privacy Notice and our
            agreement with third parties. This ensures high security and safeguards your personal information throughout
            the process, giving you peace of mind about your data's safety.
          </p>

          <h2>5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
          <p>
            <em>
              <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes
              outlined in this Privacy Notice unless otherwise required by law.
            </em>
          </p>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this
            Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting,
            or other legal requirements). No purpose in this notice will require us keeping your personal information
            for longer than the period of time in which users have an account with us.
          </p>
          <p>
            When we have no ongoing legitimate business need to process your personal information, we will either delete
            or anonymize such information, or, if this is not possible (for example, because your personal information
            has been stored in backup archives), then we will securely store your personal information and isolate it
            from any further processing until deletion is possible.
          </p>

          <h2>6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
          <p>
            <em>
              <strong>In Short:</strong> We aim to protect your personal information through a system of organizational
              and technical security measures.
            </em>
          </p>
          <p>
            We have implemented appropriate and reasonable technical and organizational security measures designed to
            protect the security of any personal information we process. However, despite our safeguards and efforts to
            secure your information, no electronic transmission over the Internet or information storage technology can
            be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other
            unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or
            modify your information. Although we will do our best to protect your personal information, transmission of
            personal information to and from our Services is at your own risk. You should only access the Services
            within a secure environment.
          </p>

          <h2>7. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
          <p>
            <em>
              <strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on
              your country, province, or state of residence.
            </em>
          </p>
          <p>
            <strong>
              <u>Withdrawing your consent:</u>
            </strong>{" "}
            If we are relying on your consent to process your personal information, which may be express and/or implied
            consent depending on the applicable law, you have the right to withdraw your consent at any time. You can
            withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW
            CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
          </p>
          <p>
            However, please note that this will not affect the lawfulness of the processing before its withdrawal nor,
            when applicable law allows, will it affect the processing of your personal information conducted in reliance
            on lawful processing grounds other than consent.
          </p>

          <h3>Account Information</h3>
          <p>
            If you would at any time like to review or change the information in your account or terminate your account,
            you can:
          </p>
          <ul>
            <li>Log in to your account settings and update your user account.</li>
          </ul>
          <p>
            Upon your request to terminate your account, we will deactivate or delete your account and information from
            our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot
            problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal
            requirements.
          </p>

          <h2>8. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
          <p>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT")
            feature or setting you can activate to signal your privacy preference not to have data about your online
            browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing
            and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals
            or any other mechanism that automatically communicates your choice not to be tracked online. If a standard
            for online tracking is adopted that we must follow in the future, we will inform you about that practice in
            a revised version of this Privacy Notice.
          </p>

          <h2>9. DATA</h2>
          <p>We do not take any responsibility for data losses</p>

          <h2>10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
          <p>
            <em>
              <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant
              laws.
            </em>
          </p>
          <p>
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated
            "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may
            notify you either by prominently posting a notice of such changes or by directly sending you a notification.
            We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your
            information.
          </p>

          <h2>11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
          <p>If you have questions or comments about this notice, you may contact us by post at:</p>
          <p>
            PureMind Inc.
            <br />
            __________
            <br />
            __________
          </p>

          <h2>12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
          <p>
            You have the right to request access to the personal information we collect from you, details about how we
            have processed it, correct inaccuracies, or delete your personal information. You may also have the right to
            withdraw your consent to our processing of your personal information. These rights may be limited in some
            circumstances by applicable law. To request to review, update, or delete your personal information, please
            visit:{" "}
            <a href="https://puremind.netlify.app" className="text-primary hover:underline">
              puremind.netlify.app
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

