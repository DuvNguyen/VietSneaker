package com.example.clockee_server.config;

// import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

/** RedisConfiguration */
@Profile("redis")
@Configuration
// @EnableCaching
public class RedisConfiguration {

  // @Value("${REDIS_HOST}")
  // private String redisHost;

  // @Value("${REDIS_PORT}")
  // private String redisPort;

  // @Bean
  // public JedisConnectionFactory jedisConnectionFactory() {
  //     RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration();
  //     configuration.setHostName(redisHost);
  //     configuration.setPort(Integer.parseInt(redisPort));
  //     return new JedisConnectionFactory(configuration);
  // }

  // @Bean
  // public RedisTemplate<String, Object> redisTemplate() {
  //     RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
  //     redisTemplate.setConnectionFactory(jedisConnectionFactory());

  //     redisTemplate.setKeySerializer(new StringRedisSerializer());
  //     redisTemplate.setHashKeySerializer(new StringRedisSerializer());
  //     redisTemplate.setValueSerializer(new GenericJackson2JsonRedisSerializer());
  //     redisTemplate.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());

  //     return redisTemplate;
  // }

}
