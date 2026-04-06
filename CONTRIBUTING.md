# Contributing Guidelines

## Code of Conduct

Please be respectful and professional when contributing to this project.

## How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/quizapp.git
cd quizapp
git checkout -b feature/your-feature-name
```

### 2. Setup Development Environment

**Backend:**
```bash
cd Backend/quizapp
./mvnw clean install
```

**Frontend:**
```bash
cd quiz-frontend
npm install
```

### 3. Create Feature Branch

```bash
git checkout -b feature/add-quiz-filters
# or
git checkout -b fix/login-bug
# or
git checkout -b docs/update-readme
```

### 4. Commit Guidelines

Follow conventional commits:

```bash
git commit -m "feat(quiz): add advanced filtering options"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs: update API documentation"
```

**Commit Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Dependency updates, build changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a PR on GitHub with:
- Clear title describing the change
- Detailed description
- Reference to related issues
- Screenshots (if UI changes)

## Development Standards

### Backend (Java/Spring Boot)

**Code Style:**
- Use 4 spaces for indentation
- Follow Google Java Style Guide
- Use meaningful variable names
- Add JavaDoc for public methods

**Example:**
```java
/**
 * Retrieves user statistics including quiz performance metrics
 * 
 * @param userId the ID of the user
 * @return UserStatsDTO containing statistics
 * @throws ResourceNotFoundException if user not found
 */
public UserStatsDTO getUserStats(Long userId) {
    UserEntity user = getUserById(userId);
    return resultService.getUserStats(userId);
}
```

**Testing:**
- Write unit tests for services
- Write integration tests for controllers
- Aim for 70%+ code coverage

```java
@Test
public void testGetUserStats_Success() {
    // Arrange
    UserStatsDTO expected = new UserStatsDTO();
    when(userService.getUserById(1L)).thenReturn(mockUser);
    
    // Act
    UserStatsDTO result = userService.getUserStats(1L);
    
    // Assert
    assertNotNull(result);
}
```

### Frontend (React/JavaScript)

**Code Style:**
- Use 2 spaces for indentation
- Use arrow functions
- Use functional components
- Add PropTypes or TypeScript types

**Example:**
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const QuizCard = ({ quiz, onStart }) => {
  return (
    <div className="card">
      <h2>{quiz.title}</h2>
      <button onClick={() => onStart(quiz.id)}>Start Quiz</button>
    </div>
  );
};

QuizCard.propTypes = {
  quiz: PropTypes.object.isRequired,
  onStart: PropTypes.func.isRequired,
};

export default QuizCard;
```

**Testing:**
- Write unit tests for components
- Test user interactions
- Mock API calls

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import QuizCard from './QuizCard';

test('renders quiz card with title', () => {
  const mockQuiz = { id: 1, title: 'Test Quiz' };
  render(<QuizCard quiz={mockQuiz} onStart={() => {}} />);
  
  expect(screen.getByText('Test Quiz')).toBeInTheDocument();
});
```

## Pull Request Process

1. **Update documentation** - If adding features, update README or API docs
2. **Add tests** - Ensure new code has tests
3. **Run linter** - Check code style
4. **Update changelog** - Add entry to CHANGELOG.md
5. **Request review** - Get approval from maintainers
6. **Merge** - Use "Squash and merge" for clean history

## Issue Reporting

When reporting bugs, include:
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/logs
- Environment (OS, browser, Node version, etc)

**Template:**
```markdown
## Bug Description
[Describe the bug]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 20.0]
```

## Feature Requests

When requesting features, include:
- Use case - Why is this needed?
- Proposed solution
- Alternative solutions
- Additional context

## Code Review Guidelines

### For Reviewers:
- Check code for bugs and edge cases
- Ensure tests are adequate
- Verify documentation is updated
- Check for performance issues
- Provide constructive feedback

### For Contributors:
- Address all review comments
- Test changes before pushing
- Keep commits clean and organized
- Communicate proactively

## Running Tests

### Backend Tests
```bash
cd Backend/quizapp

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# With coverage
./mvnw test jacoco:report
```

### Frontend Tests
```bash
cd quiz-frontend

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Building for Production

### Backend
```bash
cd Backend/quizapp
./mvnw clean package -DskipTests
```

### Frontend
```bash
cd quiz-frontend
npm run build
npm run preview  # Test build locally
```

## Performance Guidelines

**Backend:**
- Use database indexing for frequent queries
- Implement caching for static data
- Use pagination for large datasets
- Profile code for bottlenecks

**Frontend:**
- Code split large components
- Lazy load routes
- Optimize images
- Use React DevTools Profiler

## Documentation

- Update README.md for user-facing changes
- Update API docs in Swagger comments
- Add inline comments for complex logic
- Keep CHANGELOG.md updated

## Questions?

- Check existing issues and PRs
- Ask in issue comments
- Contact maintainers
- Read project documentation

## Thank You!

Your contributions make this project better. Thank you for participating! 🎉
