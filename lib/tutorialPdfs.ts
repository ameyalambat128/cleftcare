import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";

const pdfJsVersion = "3.11.174";

export const tutorialPdfs = [
  {
    id: "english",
    title: "English Tutorial",
    language: "English",
    description: "CleftCare tutorial guide in English.",
    asset: require("../assets/tutorials/CleftCare-TutorialScreenContent_English.pdf"),
  },
  {
    id: "kannada",
    title: "Kannada Tutorial",
    language: "Kannada",
    description: "CleftCare tutorial guide in Kannada.",
    asset: require("../assets/tutorials/CleftCare-TutorialScreenContent_Kannada.pdf"),
  },
] as const;

export type TutorialPdfId = (typeof tutorialPdfs)[number]["id"];

export const getTutorialPdf = (id?: string) =>
  tutorialPdfs.find((tutorial) => tutorial.id === id) ?? tutorialPdfs[0];

export const loadTutorialPdf = async (id?: string) => {
  const tutorial = getTutorialPdf(id);
  const asset = await Asset.fromModule(tutorial.asset).downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return { tutorial, base64 };
};

export const buildPdfViewerHtml = (base64: string, title: string) => `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=4" />
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        min-height: 100%;
        background: #f7f7f5;
        color: #161616;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      #toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid #dfded9;
        background: rgba(247, 247, 245, 0.96);
      }

      #title {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 700;
      }

      #actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      button {
        width: 34px;
        height: 34px;
        border: 1px solid #c8c7c1;
        border-radius: 8px;
        background: #ffffff;
        color: #161616;
        font-size: 20px;
        font-weight: 600;
      }

      #zoom {
        min-width: 44px;
        text-align: center;
        font-size: 13px;
        font-variant-numeric: tabular-nums;
      }

      #status {
        padding: 24px 16px;
        color: #5f6368;
        text-align: center;
        font-size: 14px;
      }

      #pages {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 14px 12px 28px;
      }

      canvas {
        width: 100%;
        height: auto;
        border: 1px solid #dfded9;
        border-radius: 8px;
        background: #ffffff;
      }
    </style>
  </head>
  <body>
    <div id="toolbar">
      <div id="title"></div>
      <div id="actions">
        <button id="zoomOut" aria-label="Zoom out">-</button>
        <span id="zoom">100%</span>
        <button id="zoomIn" aria-label="Zoom in">+</button>
      </div>
    </div>
    <div id="status">Loading PDF...</div>
    <div id="pages"></div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJsVersion}/pdf.min.js"></script>
    <script>
      const base64 = "${base64}";
      const title = ${JSON.stringify(title)};
      let pdfDocument = null;
      let zoom = 1;
      let renderToken = 0;

      const status = document.getElementById("status");
      const pages = document.getElementById("pages");
      const zoomLabel = document.getElementById("zoom");
      document.getElementById("title").textContent = title;
      const setStatus = (message) => {
        status.textContent = message;
        status.style.display = message ? "block" : "none";
      };

      const decodeBase64 = (value) => {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
      };

      const renderPages = async () => {
        if (!pdfDocument) return;

        const token = (renderToken += 1);
        pages.replaceChildren();
        setStatus("Rendering " + title + "...");
        zoomLabel.textContent = Math.round(zoom * 100) + "%";

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          if (token !== renderToken) return;

          const page = await pdfDocument.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const availableWidth = Math.min(document.documentElement.clientWidth - 24, 920);
          const fitScale = availableWidth / baseViewport.width;
          const viewport = page.getViewport({ scale: fitScale * zoom });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.maxWidth = viewport.width + "px";
          pages.appendChild(canvas);

          await page.render({ canvasContext: context, viewport }).promise;
        }

        if (token === renderToken) setStatus("");
      };

      const initialize = async () => {
        try {
          if (!window.pdfjsLib) throw new Error("PDF renderer failed to load");

          pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJsVersion}/pdf.worker.min.js";

          pdfDocument = await pdfjsLib.getDocument({ data: decodeBase64(base64) }).promise;
          await renderPages();
        } catch (error) {
          setStatus(error.message || "Unable to load PDF");
        }
      };

      document.getElementById("zoomOut").addEventListener("click", () => {
        zoom = Math.max(0.7, zoom - 0.15);
        renderPages();
      });

      document.getElementById("zoomIn").addEventListener("click", () => {
        zoom = Math.min(2, zoom + 0.15);
        renderPages();
      });

      window.addEventListener("resize", renderPages);
      initialize();
    </script>
  </body>
</html>
`;
