# ---- Stage 1: build the jar ----
# We build inside the image so we don't need Maven/Java installed on the server.
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom first and download deps — this layer is cached unless pom changes,
# so rebuilds are much faster.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the source and build the jar (skip tests here; CI already ran them)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Stage 2: tiny runtime image ----
# Only the JRE + our jar end up in the final image — no Maven, no source.
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
