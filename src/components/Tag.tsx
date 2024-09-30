import React from "react";

type Props = {
  text: string;
};

export default function Tag({ text }: Props) {
  return (
    <div className="flex items-center justify-center px-2 py-1 border border-black rounded-lg">
      {text}
    </div>
  );
}
