import React from "react";

export const Flex = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div {...props} className={`flex w-full ${props.className ?? ""}`}>
    {props.children}
  </div>
);
