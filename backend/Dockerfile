# Build stage
FROM docker.io/library/golang:1.24-alpine AS builder

# Install git and other dependencies required for go modules
RUN apk add --no-cache git

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./
RUN go build -o app .

# Final stage (minimal image)
FROM alpine:latest

# Add a non-root user for security (optional but recommended)
RUN adduser -D -g '' appuser

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/app .

# Set permissions
RUN chown -R appuser /app
USER appuser

# Expose app port if needed
# EXPOSE 8080

# Command to run the app
CMD ["./app"]
