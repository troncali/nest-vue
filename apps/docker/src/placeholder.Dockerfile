# Reduce image bloat with a prebuild to gather production files and dependencies
FROM ekidd/rust-musl-builder:1.57.0 AS prebuild
	# Cache dependencies
	WORKDIR /home/rust/src/
	RUN cargo new --bin apps/placeholder
	COPY ./Cargo.lock ./Cargo.toml ./
	RUN cargo build --release && rm ./apps/placeholder/src/*.rs
	# Build code
	ADD ./apps/placeholder ./apps/placeholder
	RUN rm ./target/x86_64-unknown-linux-musl/release/deps/placeholder* \
		&& cargo build --release

# Build the production image
FROM alpine:3.16.1 AS production
	RUN addgroup -S placeholder && adduser -S -g placeholder placeholder \
		&& mkdir -p /app && chown -R placeholder:placeholder /app
	WORKDIR /app
	COPY --from=prebuild --chown=placeholder:placeholder \
		/home/rust/src/target/x86_64-unknown-linux-musl/release/placeholder .
	USER placeholder
	EXPOSE ${BACKEND_PORT}
	CMD ["./placeholder"]
