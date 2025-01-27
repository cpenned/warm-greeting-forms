import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  name: string;
}

export const ConfirmationEmail = ({
  name,
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for contacting us!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>Lovable</Text>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>Thank you for reaching out, {name}!</Heading>
          <Text style={text}>
            We've received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.
          </Text>
          <Text style={text}>
            In the meantime, if you have any urgent questions, feel free to check our{' '}
            <Link href="https://lovable.dev" style={link}>documentation</Link>.
          </Text>
          <Text style={signature}>
            Best regards,<br />
            The Lovable Team
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 Lovable. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const contentSection = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}

const logoSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
}

const logo = {
  color: '#000',
  fontSize: '32px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '0',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  padding: '0',
}

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const signature = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '32px',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0 0',
}

const footerText = {
  fontSize: '12px',
  color: '#718096',
  margin: '0',
}