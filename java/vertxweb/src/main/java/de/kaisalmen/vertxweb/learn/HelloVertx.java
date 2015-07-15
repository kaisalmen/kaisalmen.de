package de.kaisalmen.vertxweb.learn;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;

/**
 * Simplest way to create a super simple vert.x HttpServer serving static files
 * 
 * @author Kai Salmen
 *
 */
public class HelloVertx {

	private Vertx vertx;
	
	public HelloVertx() {
		vertx = Vertx.vertx();
	}
	
	public void launch() {
		HttpServer httpServer = vertx.createHttpServer();
		Router router = Router.router(vertx);

		StaticHandler staticHandler = StaticHandler.create();
		staticHandler.setWebRoot("./webroot"); 
	    router.route().handler(staticHandler);
/*
	    router.get("/").handler(routingContext -> {
			HttpServerResponse response = routingContext.response();
			response.putHeader("content-type", "text/plain");
			response.end("Hello World!");
		});
*/
		httpServer.requestHandler(router::accept).listen(8081);
	}
	

	public static void main(String[] args) {
		HelloVertx helloVertx = new HelloVertx();
		helloVertx.launch();
	}
}
