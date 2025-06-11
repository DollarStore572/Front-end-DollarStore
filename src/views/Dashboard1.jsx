import { Container, Card } from "react-bootstrap";

const Dashboard1= () => {
  return (
    <Container>
      <br />
      <Card style={{ height: 600 }}>
      <iframe title="dashboard.1" width="1100" height="500.5" 
      src="https://app.powerbi.com/view?r=eyJrIjoiNTBhMGNlOWMtM2FlYy00NjI1LWFkZjItNDQ5YTU4ZTc1OTdiIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9" 
      frameborder="0" allowFullScreen="true"></iframe>
      </Card>
    </Container>
  );
};

export default Dashboard1