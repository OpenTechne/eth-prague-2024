"use client";
import { useState } from "react";
import DynamicForm from "../src/components/DynamicForm";
import FileUploader from "../src/components/FileUploader";
import { useToast } from "@chakra-ui/react";
import UserEnv from "@/src/components/UserEnv";
import LoadingPage from "@/src/components/LoadingPage";
import NotifyPage from "@/src/components/NotifyPage";

export default function Home() {
  const toast = useToast();

  const [contract, setContract] = useState({abi: [], bytecode: ""});
  const [fields, setFields] = useState([]);
  const [contractDeployData, setContractDeployData] = useState({
    //TODO: Change this to default data (empty)
    contractLink:
      "https://sepolia.lineascan.build/address/0x72214e2ca2a2da93dae89a9d87a5515d6e836001",
    contractAddress: "0x72214e2ca2a2da93dae89a9d87a5515d6e836001",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_landlord",
            type: "address",
          },
        ],
      },
    ],
  });
  const [view, setView] = useState("UPLOAD");

  function getFormFieldsFromContract(contractCode) {
    const constructorRegex = /constructor\s*\(([^)]*)\)/;
    const match = contractCode.match(constructorRegex);

    if (!match) {
      throw new Error("No constructor found in the contract");
    }

    const paramsString = match[1].trim();
    const params = paramsString
      .split(",")
      .map((param) => param.trim().split(/\s+/));

    const formFields = params.map((param) => {
      let [type, name] = param;

      // Handle multiple words in type (e.g., "address payable")
      if (param.length > 2) {
        type = param.slice(0, -1).join(" ");
        name = param[param.length - 1];
      }

      let fieldType = "input";
      if (type === "bool") {
        fieldType = "checkbox";
      } else if (type === "uint256") {
        fieldType = "number";
      } else if (type.startsWith("address")) {
        fieldType = "input";
      }

      return {
        type: fieldType,
        name: name.replace(/[_\s]+/g, ""),
        label: `${
          name.charAt(0).toUpperCase() +
          name
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .replace(/[_\s]+/g, " ")
        }`,
        required: true,
        value: fieldType === "checkbox" ? false : "",
        section: "form",
      };
    });

    return formFields;
  }

  const generateContract = async (document) => {
    //console.log("Generating contract from document:", document);
    setView("LOADING");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agreement: document.content,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate smart contract");
      }

      const data = await res.json();
      const {bytecode, abi } =  data;

      setContract({abi, bytecode});
      setView("FORM");
    } catch (err) {
      toast({
        title: "There was an error generating the smart contract",
        duration: 3000,
        status: "error",
        position: "bottom-right",
        variant: "subtle",
      });
      console.error(err);
      setView("UPLOAD");
    }
  };
  const onNotify = () => {
    setView("USER_ENV");
  };

  const renderView = () => {
    switch (view) {
      case "UPLOAD":
        return <FileUploader onUpload={generateContract} />;
      case "LOADING":
        return <LoadingPage />;
      case "FORM":
        return (
          <DynamicForm
            fields={fields}
            columns={2}
            contract={contract}
            setView={setView}
          />
        );
      case "NOTIFY":
        return <NotifyPage contractDeployData={contractDeployData} />;
      case "USER_ENV":
        return <UserEnv />;
    }
  };

  return <div>{renderView()}</div>;
}
