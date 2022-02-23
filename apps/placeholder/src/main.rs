use std::io::prelude::*;
use std::net::TcpListener;
use std::net::TcpStream;

use placeholder::ThreadPool;

const GET: &[u8; 15] = b"GET /api HTTP/1";
const FOUND: &str = "HTTP/1.1 200 OK";
const ERROR: &str = "HTTP/1.1 404 NOT FOUND";
const PLACEHOLDER: &str = "Placeholder";
const NOT_FOUND: &str = "Not found (Placeholder)";

fn main() {
    let listener = TcpListener::bind("0.0.0.0:3001").unwrap();
    let pool = ThreadPool::new(1);

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        pool.execute(|| {
            handle_connection(stream);
        });
    }

    println!("Shutting down.");
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    let (status_line, content) = if buffer.starts_with(GET) {
        (&FOUND, &PLACEHOLDER)
    } else {
        (&ERROR, &NOT_FOUND)
    };

    let response = format!(
        "{}\r\nContent-Length: {}\r\nContent-Type: text/plain\r\n\r\n{}",
        status_line,
        content.len(),
        content
    );

    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
