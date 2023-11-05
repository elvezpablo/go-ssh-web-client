import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import { WebLinksAddon } from 'xterm-addon-web-links';
// import { WebglAddon } from "xterm-addon-webgl";
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

type Props = {
  name: string;
  url: string;
  port?: string;
};

const Container = styled.div`
  border: 1px solid rgb(200,200,200,.4);
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: rgb(3,3,3,.3);
  min-width: 700px;


  

`;

export default function Terminal({ name, url, port }: Props) {
  const wsURL = `ws://${url}${port ? ":"+port : ""}/web-socket/ssh`;

  const fitAddon = useRef<FitAddon>(new FitAddon());
  const xTerm = useRef<XTerm | undefined>();
  const xTermDiv = useRef<HTMLDivElement>(null);

  const socket = useRef<WebSocket>(new WebSocket(wsURL));
  socket.current.onclose = () => {
    if (xTerm.current) {
      xTerm.current.writeln("\r\nConnection closed.");
    }
  };

  useEffect(() => {
    xTerm.current = new XTerm({
      fontFamily: "DM Mono",
      fontSize: 12,      
      screenReaderMode: true,
      theme: {
        background: "rgb(3,3,3,.3)",        
      },
    });    
    xTerm.current.loadAddon(fitAddon.current);
    xTerm.current.loadAddon(new AttachAddon(socket.current));    
    xTerm.current.loadAddon(new WebLinksAddon());

    fitAddon.current.fit();
    
    
    if (xTermDiv.current) {
      xTerm.current.writeln(`Opening connection ${name}.`);
      xTerm.current.open(xTermDiv.current);
    } 

    socket.current.onopen = () => {
      if (xTerm.current) {
        xTerm.current.writeln("\r\nWebSocket open.");
        const windowSize = {
          high: xTerm.current.rows,
          width: xTerm.current.cols,
        };
        const blob = new Blob([JSON.stringify(windowSize)], {
          type: "application/json",
        });
        socket.current.send(blob);
        xTerm.current.focus();
      }            
    };
    return () => {
      if (xTerm.current) {
        xTerm.current.dispose();
      }
    };
  }, [socket, name]);

  return (
    <Container>
      <div ref={xTermDiv} />
    </Container>
  );
}
