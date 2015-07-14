package de.kaisalmen.vertxweb.learn;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;

/**
 * Simplest way to create a super simple vert.x HttpServer
 * 
 * @author Kai Salmen
 *
 */
public class HelloVertx {

	public HelloVertx() {
		Vertx vertx = Vertx.vertx();
		HttpServer httpServer = vertx.createHttpServer();
		Router router = Router.router(vertx);
		

		router.get("/").handler(routingContext -> {
			HttpServerResponse response = routingContext.response();
			response.end(loadIndex());
			//response.putHeader("content-type", "text/plain");
			//response.end("Hello World!");
		});
		httpServer.requestHandler(router::accept).listen(8081);
	}
	
	private String loadIndex() {
		String text = "leer";
		try {
			Path path = Paths.get("src/main/resources/index.html");
			System.out.println(path.toAbsolutePath());
			text = new String(Files.readAllBytes(path));
		} catch (IOException e) {
			 text = "Error";
		}
		
		return text;
	}

	public static void main(String[] args) {
		HelloVertx helloVertx = new HelloVertx();
	}
}
