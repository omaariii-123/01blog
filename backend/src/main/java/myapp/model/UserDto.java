package myapp.model;



public class UserDto{
	private Long id;
	private String name;
	private String email;
	private String password;

    public UserDto() {}

    public UserDto(String name, String email, String password, Long id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.id = id;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
