package com.salaboy.conferences.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.salaboy.conferences.game.model.Leaderboard;
import com.salaboy.conferences.game.model.SessionScore;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.reactive.server.WebTestClient;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.Random.class)
@ActiveProfiles("test")
public class GameUIServiceTests {

	private static MockWebServer mockWebServer;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private WebTestClient webTestClient;

	@BeforeAll
	static void setup() throws IOException {
		mockWebServer = new MockWebServer();
		mockWebServer.start();
	}

	@AfterAll
	static void clean() throws IOException {
		mockWebServer.shutdown();
	}

	@DynamicPropertySource
	static void backingServiceProperties(DynamicPropertyRegistry registry) {
		registry.add("spring.rsocket.server.port", () -> 0);
		registry.add("game.leaderboard-uri", () -> mockWebServer.url("/").uri().toString());
		registry.add("game.start-game-uri", () -> mockWebServer.url("/").uri().toString());
		registry.add("game.start-level-uri", () -> mockWebServer.url("/").uri().toString());
	}

	@Test
	public void whenNewGameStartedThenSomethingGameSessionInfo() {
		var nickname = "thomas";
		var expectedResult = """
							{
								"SessionId": %s,
								"Player": %s
							}
						""".formatted("game-" + UUID.randomUUID(), nickname);

		var mockResponse = new MockResponse()
				.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
				.setBody(expectedResult);
		mockWebServer.enqueue(mockResponse);

		webTestClient
				.post()
				.uri("/game/" + nickname)
				.exchange()
				.expectStatus().is2xxSuccessful()
				.expectBody(String.class).isEqualTo(expectedResult);
	}


	@Test
	public void whenGetLeaderboardThenReturn() throws JsonProcessingException {
		var sessionScore = new SessionScore(
				UUID.randomUUID().toString(),
				"394",
				"thomas",
				"level-713",
				false
		);
		var expectedLeaderboard = new Leaderboard(List.of(sessionScore));

		var mockResponse = new MockResponse()
				.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
				.setBody(objectMapper.writeValueAsString(expectedLeaderboard));
		mockWebServer.enqueue(mockResponse);

		webTestClient
				.get()
				.uri("/game/leaderboard")
				.exchange()
				.expectStatus().is2xxSuccessful()
				.expectBody(Leaderboard.class).isEqualTo(expectedLeaderboard);
	}

}
