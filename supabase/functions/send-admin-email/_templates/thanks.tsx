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

interface ThanksEmailProps {
  name: string;
}

export const ThanksEmail = ({
  name,
}: ThanksEmailProps) => (
  <Html>
    <Head />
    <Preview>Thank you for signing up!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you for signing up, {name}!</Heading>
        <Text style={text}>
          We're thrilled to have you as part of our community. We look forward to helping you achieve great things with our product.
        </Text>
        <Text style={signature}>
          Best regards,<br />
          The Team
        </Text>
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

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
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