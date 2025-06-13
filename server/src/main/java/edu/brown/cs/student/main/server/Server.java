package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.server.handlers.AddSongHandler;
import edu.brown.cs.student.main.server.handlers.ClearSongsHandler;
import edu.brown.cs.student.main.server.handlers.GetSongHistoryHandler;
import edu.brown.cs.student.main.server.handlers.PlagiarismHandler;
import edu.brown.cs.student.main.server.handlers.PlagiarismResult;
import edu.brown.cs.student.main.server.handlers.ProgressionHandler;
import edu.brown.cs.student.main.server.handlers.RhymeHandler;
import edu.brown.cs.student.main.server.handlers.Utils;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import java.io.IOException;
import java.util.Map;
import spark.Filter;
import spark.Spark;

/** Top Level class for our project, utilizes spark to create and maintain our server. */
public class Server {

  public static void setUpServer() throws IOException {
    int port = 3232;
    Spark.port(port);
    PlagiarismResult plagiarismResult;

    after(
        (Filter)
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });
    FirebaseUtilities firebaseUtils = new FirebaseUtilities();
    Spark.get("rhyme", new RhymeHandler());
    Spark.get("check", new PlagiarismHandler());
    Spark.post("webhook/completed", plagiarismResult = new PlagiarismResult());
    Spark.get(
        "plagiarism-result",
        (request, response) -> {
          Map<String, Object> result = plagiarismResult.getResponseMap();
          if (result != null) {
            return Utils.toMoshiJson(result);
          } else {
            response.status(404);
            return "No plagiarism result found.";
          }
        });
    Spark.get("addsong", new AddSongHandler(firebaseUtils));
    Spark.get("clearsongs", new ClearSongsHandler(firebaseUtils));
    Spark.get("getsonghistory", new GetSongHistoryHandler(firebaseUtils));
    Spark.get("progression", new ProgressionHandler());

    Spark.notFound(
        (request, response) -> {
          response.status(404); // Not Found
          System.out.println("ERROR");
          return "404 Not Found - The requested endpoint does not exist.";
        });

    Spark.init();
    Spark.awaitInitialization();

    System.out.println("Server started at http://localhost:" + port);
  }

  /**
   * Runs Server.
   *
   * @param args none
   */
  public static void main(String[] args) throws IOException {
    setUpServer();
  }
}
