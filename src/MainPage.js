// import FilterMarker from "./FilterSelect";
import React, { useState } from "react";
import FileUploadButton from "./FileUploadButton";
import RightSourceTargetSelect from "./RightSourceTargetSelect";
import LeftSourceSelect from "./LeftSourceSelect";
import CheckboxList from "./CheckboxList";
import MarkerSelector from "./MarkerSelector";
import axios from 'axios';
import ReactJson from 'react-json-view'

export default function MainPage() {
  const [selectedFileOnLeft, setSelectedFileOnLeft] = useState(null);
  const [selectedFileOnRight, setSelectedFileOnRight] = useState(null);
  const [fileContentOnLeft, setFileContentOnLeft] = useState("");
  const [fileContentOnRight, setFileContentOnRight] = useState("");
  const [sourceFileFormat, setSourceFileFormat] = useState({name:"USFM"});
  const [targetFileFormat, setTargetFileFormat] = useState({name:"USJ"});


  const handleFileUploadOnLeft = (file) => {
    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      return;
    }
    setSelectedFileOnLeft(file);
    const reader = new FileReader();
    reader.onload = function (e) {
      // const convertedData = e.target.result.replace(/\\/g, '\\\\').split('\n').join('\n');
      setFileContentOnLeft(e.target.result);
      // console.log(convertedData,"CD")
    };
    reader.readAsText(file);

    // You can perform further actions with the selected file here
  };
  const handleFileUploadOnRight = (file) => {
    if (!(file instanceof File)) {
      console.error("Invalid file object:", file);
      return;
    }
    setSelectedFileOnRight(file);
    const reader = new FileReader();
    reader.onload = function (e) {
      setFileContentOnRight(e.target.result);
    };
    reader.readAsText(file);

    // You can perform further actions with the selected file here
  };

  const handleDownloadOnLeft = () => {
    if (!fileContentOnLeft) return;
    const blob = new Blob([fileContentOnLeft], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedFileOnLeft?.name || "file.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
  const handleDownloadOnRight = () => {
    if (!fileContentOnRight) return;
    const blob = new Blob([fileContentOnRight], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    let format= targetFileFormat.name.toLowerCase();

    a.href = url;
    // a.download = selectedFileOnRight?.name || "file.txt";
    if (format === "usx") { a.download = "USX.xml"}
    else if (format === "usj") { a.download = `${sourceFileFormat.name}.json`}
    else if (format === "table") { a.download = `${sourceFileFormat.name}.tsv`}
    else if (format === "syntax-tree") { a.download = `${sourceFileFormat.name}-syntax-tree.txt`}

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleTextareaChangeOnLeft = (event) => {
    setFileContentOnLeft(event.target.value);
  };
  const handleTextareaChangeOnRight = (event) => {
    setFileContentOnRight(event.target.value);
  };
  const handlePutRequest = () => {
    // Data to be sent in the PUT request
    // console.log(fileContentOnLeft,"ff")
    let format= targetFileFormat.name.toLowerCase();
    const data = {
      // Your data here
      "USFM":fileContentOnLeft.toString()
    };

    // Axios PUT request
    axios.put(`https://stagingapi.vachanengine.org/v2/cms/rest/files/${sourceFileFormat.name.toLowerCase()}/to/${targetFileFormat.name.toLowerCase()}`, data)
      .then(response => {
        // Handle successful response
        // console.log('PUT request successful:', response.data.content.toString());
        if (format === "usj") {
        

        setFileContentOnRight(JSON.stringify(response.data, null, 4)  )
      }else if (format === "table") {
        setFileContentOnRight(response.data)
      }
        // var tableHTML = "<table class=\"table-secondary border p-2 m-1\">"
        // var rows = data.split("\n")
        // for (let row in rows) {
        //   console.log("row",rows[row])
        //   tableHTML += "<tr class=\"border\">"
        //   var cells = rows[row].split('\t')
        //   for (let cell in cells) {
        //     console.log("cell", cells[cell])
        //     tableHTML += "<td class=\"border\">"+cells[cell]+"</td>"
        //   }
        //   tableHTML += "</tr>"
        // }
        // tableHTML += "</table>"
        // outElement.innerHTML = tableHTML
       else if (format === "usx") {
        setFileContentOnRight(response.data)

        // outElement.innerHTML = "<div class=\"text-break w-100\">"+
        //                         htmlEntities(data)+"</div>"
      } else if (format === "syntax-tree") {
        setFileContentOnRight(response.data)

        // outElement.innerHTML = "<div class=\"text-break w-100\">"+
        //                         htmlEntities(prettySyntaxTree(data))+"</div>"
      }


    
    
    
    })
      .catch(error => {
        // Handle error
        console.error('Error making PUT request:', error);
      });
  };

  

  return (
    <>
    {console.log(sourceFileFormat.name,"sff")}
      <div className="h-screen min-w-48">
        <header className="bg-gray-900 py-5 h-15">
          <div className="mx-auto max-w-7xl px-4  md:px-6 lg:px-8  flex justify-center items-center">
            <h1 className="text-lg md:text-3xl font-bold  text-sky-600">
              USFM Grammar
            </h1>
          </div>
        </header>
        <main className="h-4/6 md:h-5/6">
          <div className="mt-5 mb-5 h-full md:flex justify-around ">
            {/* card 1 */}
            <div className=" border-4 min-w-64 border-sky-600 w-11/12 ml-auto mr-auto  h-full md:w-2/5 md:ml-4 md:mr-0 rounded-lg overflow-hidden">
              <div className=" p-5 h-1/6 flex justify-between items-center">
                <LeftSourceSelect onChange={setSourceFileFormat}/>

                <div className="flex">
                  <FileUploadButton onChange={handleFileUploadOnLeft} />
                  <button
                    className="ml-5 border-2 rounded-lg bg-black text-white hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 w-10 h-10 p-1.5 "
                    // className="ml-5 cursor-pointer bg-black hover:bg-sky-600 text-white font-bold py-2 px-2 rounded"
                    onClick={handleDownloadOnLeft}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="main-grid-item-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </button>
                  {/* <div className=""> */}
                  {/* <h1 className="text-2xl font-bold mb-4">File Upload Example</h1> */}

                  {/* {selectedFile && (
        <div className="mt-4">
          <p className="font-semibold">Selected File:</p>
          <p>{selectedFile.name}</p>
        </div>
      )} */}
                  {/* </div> */}
                </div>
              </div>
              <div className="w-full  border-t h-5/6">
              {/* {sourceFileFormat.name==='USJ'?
              (fileContentOnLeft.length>0 &&
              <ReactJson  src={fileContentOnLeft} />)
              : */}
                <textarea
                  className=" w-full h-full"
                  value={fileContentOnLeft}
                  onChange={handleTextareaChangeOnLeft}
                  readOnly={!selectedFileOnLeft}
                />
              {/* } */}
              </div>
            </div>
            <div className="border-3 h-72   md:h-full md:w-1/5 flex flex-col items-center justify-start border">
              <button className="hidden md:block md:inline-flex text-sm items-center ml-5 border-2 rounded bg-sky-600 text-white hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 w-24 h-10 p-1 "
              onClick={handlePutRequest}
              >
                Process
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="main-grid-item-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <button className="md:hidden inline-flex text-sm items-center ml-5 border-2 rounded bg-sky-600 text-white hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 w-24 h-10 p-1 ">
                Process
                <svg
                  data-slot="icon"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  ></path>
                </svg>
              </button>
              {targetFileFormat.name.toLowerCase()==="usj" && (
                <>
              <div className="mt-10 border-2 ">
                <MarkerSelector />
              </div>
              <div className="mt-10">
                {" "}
                {/* <div className="text-xs sm:text-xs text-sky-600 text-center">
                  filter
                </div> */}
                {/* <FilterMarker /> */}
                {/* <"> */}
                <CheckboxList />
                {/* </div> */}
              </div></>)}
            </div>
            {/* card 2 */}
            <div className=" border-4 min-w-64 border-sky-600 w-11/12 ml-auto mr-auto h-full md:w-2/5 md:ml-0 md:mr-4 rounded-lg overflow-hidden">
              <div className=" p-5 h-1/6 flex justify-between items-center">
              <div className="flex items-center">
                <div>
                  <div className="text-xs sm:text-xs text-sky-600 text-left h-3">
                    target
                  </div>
                  <RightSourceTargetSelect onChange={setTargetFileFormat} />
                </div>
                {/* <div className="flex sm:flex-wrap sm:justify-center"> */}
                  <button className="inline-flex text-xs items-center ml-5 border-2 rounded bg-sky-600 text-white md:text-sm justify-center hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 w-15 h-10 p-1">
                    <svg
                      className="h-5 w-5"
                      data-slot="icon"
                      fill="none"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                      ></path>
                    </svg>
                    Copy to Source
                  </button>
                  </div>
                {/* </div> */}
                <div className="flex">
                  <FileUploadButton onChange={handleFileUploadOnRight} />

                  <button
                    className="ml-1 md:ml-5  border-2 rounded-lg bg-black text-white hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 w-10 h-10 p-1.5 "
                    onClick={handleDownloadOnRight}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="main-grid-item-icon"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className=" border-t w-full  h-5/6">
                 {/* {targetFileFormat.name==='USJ'?
              (fileContentOnRight.length>0 &&
              <ReactJson  src={fileContentOnRight} />)
              : */}
                <textarea
                  className=" w-full h-full"
                  value={fileContentOnRight}
                  onChange={handleTextareaChangeOnRight}
                  readOnly={!selectedFileOnRight}
                />
                {/* } */}
              </div>
            </div>
          </div>
        </main>
        <div className="h-5"></div>
      </div>
    </>
  );
}
