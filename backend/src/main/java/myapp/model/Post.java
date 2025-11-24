package myapp.model;

import jakarta.presistence.*;
import lombok.*;

@Entity
@table(name="posts")
@Data
@NoArgsConstructor
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private String description;
}
