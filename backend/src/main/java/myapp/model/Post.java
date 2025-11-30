package myapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "posts")
@Data
@NoArgsConstructor
public class Post {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	private long userId;
	private String description;
}
