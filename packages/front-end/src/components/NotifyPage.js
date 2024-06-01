import React, { useEffect, useState } from "react";

import { Button, Input } from "@chakra-ui/react";
import PageWrapper from "./PageWrapper";
const NotifyPage = ({ setTenantEmail }) => {
  const buttons = (
    <div className="mr-[40px]">
      <Button
        className="m-[10px]"
        variant="outline"
        colorScheme="black"
        bg="white"
      >
        Notify
      </Button>
      <Button
        variant="outline"
        color="grayText"
        bg="white"
        onClick={() => setTenantEmail()}
      >
        Cancel
      </Button>
    </div>
  );

  const body = (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center mt-[20px]">
        <p>Congratulations!</p>
        <p>Your contract has been deployed.</p>
      </div>
      <p className="text-center mt-[15px]">
        You now may add the tenant’s email and notify them.
      </p>
      <Input
        placeholder="Enter your tenant’s email here..."
        size="lg"
        className="text-center my-[20px]"
        width="350px"
      />
    </div>
  );

  return <PageWrapper bottom={buttons}>{body}</PageWrapper>;
};

export default NotifyPage;