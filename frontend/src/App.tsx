import Layout from "@/components/ui/Layout";
import logo from "@/assets/images/logo-universal.png";

function App() {
  const logoSize = 400;

  return (
    <Layout id="app">
      <img
        width={logoSize}
        height={logoSize}
        draggable={false}
        src={logo}
        alt="logo"
      />

      <h1>Hello World</h1>
    </Layout>
  );
}

export default App;
