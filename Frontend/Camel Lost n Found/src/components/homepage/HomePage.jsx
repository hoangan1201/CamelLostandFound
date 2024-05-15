import Header from "../Header/Header";
import Body from "../Body";
import React, { useState } from "react";
import ServerError from "../ErrorHandling/ServerError";

function HomePage(props) {
  const [fetchError, setFetchError] = useState(false);
  if (fetchError) {
    return <ServerError />;
  }
  return (
    <div
      style={{
        backgroundColor: "#454444",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/asfalt-light.png')",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Body myPost={props.myPost} setFetchError={setFetchError} />
    </div>
  );
}
//#333333
export default HomePage;
