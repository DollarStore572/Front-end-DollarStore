import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container>
      <br />
      <Card style={{ height: 600 }}>
      <iframe title="DASBOARDKpiCLIENTES" width="1100"
      height="500.5" src="https://app.powerbi.com/view?r=eyJrIjoiN2JmY2UyNGItNzQ0ZC00YzcxLWEzMjEtMTM0YzI2NzE0MzAzIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
      frameborder="0" allowFullScreen="true"></iframe>
      </Card>
    </Container>
  );
};

export default Dashboard;