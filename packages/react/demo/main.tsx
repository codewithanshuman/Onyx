import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarStack, Badge, Button, Card, CardBody, CardFooter, CardText, CardTitle,
  Checkbox, Container, DropdownMenu, Field, Input, Kbd, Modal, Progress, Radio, Row, SegmentedControl, Select, Skeleton,
  Spinner, Stack, Switch, Tab, TabList, TabPanel, Tabs, Textarea, ThemeProvider, ToastProvider, Tooltip, useTheme, useToast
} from "../src";

function SignUp() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  return (
    <Card>
      <CardBody>
        <CardTitle>Create account</CardTitle>
        <CardText>Validation, hints and errors are wired up by Field.</CardText>
        <Stack gap={4} style={{ marginTop: "var(--ox-space-5)" }}>
          <Field label="Email" hint="We'll never share it." error={error}>
            <Input type="email" value={email} placeholder="you@studio.com" onChange={(e) => { setEmail(e.target.value); setError(undefined); }} />
          </Field>
          <Field label="Role">
            <Select defaultValue="Designer"><option>Designer</option><option>Engineer</option></Select>
          </Field>
          <Checkbox label="I agree to the terms" defaultChecked />
          <Button block onClick={() => (/^\S+@\S+\.\S+$/.test(email) ? toast("Welcome aboard") : setError("Enter a valid email."))}>Sign up</Button>
        </Stack>
      </CardBody>
    </Card>
  );
}

function Controls() {
  const [range, setRange] = useState<"7d" | "30d" | "1y">("30d");
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return (
    <Card>
      <CardBody>
        <CardTitle>Controls</CardTitle>
        <Stack gap={4} style={{ marginTop: "var(--ox-space-5)" }}>
          <Row>
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Saving</Button>
          </Row>
          <Row>
            <SegmentedControl aria-label="Range" value={range} onChange={setRange} options={[{ value: "7d", label: "7 days" }, { value: "30d", label: "30 days" }, { value: "1y", label: "1 year" }]} />
            <Tooltip content="Search"><Button variant="outline" icon aria-label="Search">⌕</Button></Tooltip>
          </Row>
          <Switch label="Email notifications" defaultChecked />
          <Row><Radio name="plan" label="Monthly" defaultChecked /><Radio name="plan" label="Yearly" /></Row>
          <Row>
            <Button variant="outline" onClick={() => setOpen(true)}>Open modal</Button>
            <DropdownMenu
              label="Project"
              trigger={<Button variant="outline">Menu ▾</Button>}
              items={[
                { label: "Rename", shortcut: "R", onSelect: () => toast("Rename") },
                { label: "Duplicate", onSelect: () => toast("Duplicated") },
                "separator",
                { label: "Delete", onSelect: () => toast("Deleted") }
              ]}
            />
          </Row>
        </Stack>
      </CardBody>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Archive project?"
        description="You can restore it within 30 days."
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setOpen(false); toast("Archived"); }}>Archive</Button></>}
      />
    </Card>
  );
}

function Display() {
  return (
    <Card>
      <CardBody>
        <CardTitle>Display</CardTitle>
        <Stack gap={4} style={{ marginTop: "var(--ox-space-5)" }}>
          <Row><Badge variant="solid">Solid</Badge><Badge>Subtle</Badge><Badge variant="outline">Outline</Badge><Badge live>Live</Badge></Row>
          <Row><AvatarStack><Avatar initials="AL" solid /><Avatar initials="GH" /><Avatar initials="+5" /></AvatarStack><span className="ox-muted">7 members</span></Row>
          <Progress value={68} label="Storage" />
          <Row><Spinner /><span className="ox-muted">Syncing…</span><Kbd>Ctrl</Kbd><Kbd>K</Kbd></Row>
          <Row style={{ flexWrap: "nowrap" }}><Skeleton width={36} height={36} radius="50%" /><Stack gap={2} style={{ flex: 1 }}><Skeleton width="70%" /><Skeleton width="40%" /></Stack></Row>
          <Alert title="Heads up">You'll reach your limit in 12 days.</Alert>
        </Stack>
      </CardBody>
      <CardFooter><Row between><span className="ox-muted" style={{ fontSize: 13 }}>Card footer</span><Button size="sm">Action</Button></Row></CardFooter>
    </Card>
  );
}

function App() {
  const { resolved, toggle } = useTheme();
  return (
    <Container style={{ padding: "48px 16px" }}>
      <Row between style={{ marginBottom: 32 }}>
        <div>
          <h1 className="ox-h1" style={{ margin: 0 }}>@onyx-ui/react</h1>
          <p className="ox-muted" style={{ margin: "6px 0 0" }}>Every component on this page is a React component.</p>
        </div>
        <Button variant="outline" onClick={toggle}>{resolved === "dark" ? "Light" : "Dark"} mode</Button>
      </Row>
      <div className="ox-grid">
        <SignUp />
        <Controls />
        <Display />
      </div>
      <Card style={{ marginTop: 24 }}>
        <CardBody>
          <Tabs defaultValue="overview">
            <TabList aria-label="Project"><Tab value="overview">Overview</Tab><Tab value="activity">Activity</Tab><Tab value="settings">Settings</Tab></TabList>
            <TabPanel value="overview"><Textarea defaultValue="Tabs support arrow keys, Home and End." /></TabPanel>
            <TabPanel value="activity">Grace updated the tokens 2 hours ago.</TabPanel>
            <TabPanel value="settings">Manage members and billing.</TabPanel>
          </Tabs>
          <Accordion className="demo-acc">
            <AccordionItem title="Does it need onyx.js?" defaultOpen>No. Behavior lives in the React components.</AccordionItem>
            <AccordionItem title="Server rendering?">Yes. Components only touch the DOM in effects.</AccordionItem>
          </Accordion>
        </CardBody>
      </Card>
    </Container>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
