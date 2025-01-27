import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ImproveEmailProps {
  name: string;
}

export const ImproveEmail = ({
  name,
}: ImproveEmailProps) => (
  <Html>
    <Head />
    <Preview>Help us improve our product</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>Lovable</Text>
        </Section>
        <Section style={contentSection}>
          <Heading style={h1}>Hi {name},</Heading>
          <Text style={text}>
            We're constantly working to make our product better, and your feedback is invaluable to us.
          </Text>
          <Text style={text}>
            Could you take a moment to let us know what we could improve? What features would make your experience even better?
          </Text>
          <Text style={text}>
            Simply reply to this email with your thoughts - we read every response!
          </Text>
          <Text style={signature}>
            Thank you,<br />
            The Lovable Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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

const signature = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '32px',
}