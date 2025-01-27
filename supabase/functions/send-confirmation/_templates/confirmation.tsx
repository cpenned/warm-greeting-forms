import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
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
        <Heading style={h1}>Thank you for contacting us, {name}!</Heading>
        <Text style={text}>
          We have received your message and will get back to you as soon as possible.
        </Text>
        <Text style={footer}>
          Best regards,<br />
          The Lovable Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '24px 0',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '32px',
  marginBottom: '24px',
}