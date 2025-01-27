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
        <Heading style={h1}>Hello {name},</Heading>
        <Text style={text}>
          We hope you're enjoying our product. We're constantly working to make it better, and your feedback would be invaluable.
        </Text>
        <Text style={text}>
          Could you take a moment to let us know:
        </Text>
        <Text style={list}>
          • What features do you find most useful?<br />
          • What could we improve?<br />
          • What features would you like to see added?
        </Text>
        <Text style={text}>
          Simply reply to this email with your thoughts. We read and consider all feedback carefully.
        </Text>
        <Text style={signature}>
          Thank you for your help!<br />
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

const list = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
  paddingLeft: '20px',
}

const signature = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '32px 0 0',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '32px',
}