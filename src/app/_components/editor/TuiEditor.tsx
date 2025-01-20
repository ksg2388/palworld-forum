"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as EditorType } from "@toast-ui/react-editor";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

const Editor = dynamic(
  () => import("@toast-ui/react-editor").then((mod) => mod.Editor),
  { ssr: false }
);

const TuiEditor = forwardRef<EditorType>((_, ref) => {
  return (
    <Editor
      ref={ref}
      initialValue=""
      previewStyle="vertical"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      hideModeSwitch={true}
      plugins={[colorSyntax]}
    />
  );
});

TuiEditor.displayName = "TuiEditor";

export default TuiEditor;
