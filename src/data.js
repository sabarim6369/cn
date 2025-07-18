export const experimentsData = [
 
  {
    id: 3,
    title: "PROLOG",
    subdivisions: [
      {
        id: "Sum of Two Numbers",
        title: "Sum of Two Numbers",
        content: `read_number(N) :- read(N), number(N).
main :- write('Enter first: '), read_number(N1),
        write('Enter second: '), read_number(N2),
        S is N1 + N2,
        format('Sum: ~w~n', [S]).
`,
      },
      {
        id: "Greatest of Three Numbers",
        title: "Greatest of Three Numbers",
        content: `read_number(N) :- read(N), number(N).
max_of_three(X,Y,Z,Max) :- max(X,Y,T), max(T,Z,Max).
max(X,Y,X) :- X >= Y. max(X,Y,Y) :- Y > X.
main :- write('Enter 3 numbers: '), read_number(A), read_number(B), read_number(C),
        max_of_three(A,B,C,Max),
        format('Greatest: ~w~n', [Max]).

`,
      },
      {
        id: "Factorial",
        title: "Factorial",
        content: `read_number(N) :- read(N), number(N).
factorial(0,1).
factorial(N,R) :- N > 0, N1 is N-1, factorial(N1,F1), R is N*F1.
main :- write('Enter a number: '), read_number(N),
        factorial(N,R),
        format('Factorial: ~w~n', [R]).

`,
      },
      {
        id: " Query to Run Any Program",
        title: "Query to Run Any Program",
        content: `?- main.
`,
      },
  
    ],
  },
  {
    id: 5,
    title: "TSP in PROLOG",
    subdivisions: [
      {
        id: " Prolog Program",
        title: " Prolog Program",
        content: `% Define paths (edges with costs)
edge(a, b, 10). edge(a, c, 15). edge(a, d, 20).
edge(b, c, 35). edge(b, d, 25). edge(c, d, 30).
edge(b, a, 10). edge(c, a, 15). edge(d, a, 20).
edge(c, b, 35). edge(d, b, 25). edge(d, c, 30).

% Generate permutations
permute([], []).
permute(List, [H|Perm]) :- select(H, List, Rest), permute(Rest, Perm).

% Calculate total cost
total_cost([H1, H2 | T], Cost) :-
    edge(H1, H2, C),
    total_cost([H2 | T], SubCost),
    Cost is C + SubCost.
total_cost([H1, H2], Cost) :- edge(H1, H2, Cost).

% TSP solver
tsp(Start, Path, MinCost) :-
    findall(P, (permute([b, c, d], P), append([Start], P, Temp), append(Temp, [Start], PFull)), Paths),
    findall(C, (member(P, Paths), total_cost(P, C)), Costs),
    min_list(Costs, MinCost),
    member(Path, Paths), total_cost(Path, MinCost).

`,
      },
      {
        id: " Query to Run",
        title: " Query to Run",
        content: `?- tsp(a, Path, Cost).
`,
      },
    ],
  },
  {
    id: 6,
    title: " 4-Queens Problem – 4×4 Chessboard in PROLOG",
    subdivisions: [
      {
        id: "Prolog Program",
        title: "Prolog Program",
        content: `% Ensure valid placements
valid([]).
valid([Q|Others]) :- 
    no_attack(Q, Others, 1),
    valid(Others).

% Diagonal and row check (ensure no attacks)
no_attack(_, [], _).
no_attack(Q, [Q1|Others], Dist) :-
    Q =\= Q1,                         % Not in the same row
    abs(Q - Q1) =\= Dist,             % Not on the same diagonal
    NextDist is Dist + 1,
    no_attack(Q, Others, NextDist).

% Main predicate to solve 4-Queens
four_queens(Pos) :-
    Pos = [Q1, Q2, Q3, Q4],
    permutation([1, 2, 3, 4], Pos),
    valid(Pos).
`,
      },
      {
        id: " Query to Run",
        title: " Query to Run",
        content: `?- four_queens(Pos).

`,
      },
    
    ],
  },
  {
    id: 7,
    title: "Pac-Man Navigation using BFS (Python)",
    subdivisions: [
      {
        id: "Python Program",
        title: "Python Program",
        content: `from collections import deque

# Pac-Man Maze
maze = [
 ['P', '.', '.', '#', 'G'],
 ['#', '#', '.', '#', '.'],
 ['.', '.', '.', '.', '.'],
 ['G', '#', '.', '#', 'E'],
 ['.', '.', 'G', '.', '.']
]

# Move directions: Up, Down, Left, Right
moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]

def bfs_pacman(maze):
    rows, cols = len(maze), len(maze[0])
    queue = deque()
    visited = set()

    # Find Pac-Man's starting point
    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == 'P':
                start = (r, c)
    
    queue.append((start, [start]))  # (current_position, path)
    visited.add(start)

    while queue:
        (r, c), path = queue.popleft()

        if maze[r][c] == 'E':  # Goal reached
            return path

        for dr, dc in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                if (nr, nc) not in visited and maze[nr][nc] not in ['#', 'G']:
                    queue.append(((nr, nc), path + [(nr, nc)]))
                    visited.add((nr, nc))

    return "No path found"

# Run BFS
shortest_path = bfs_pacman(maze)
print("Shortest Path:", shortest_path)
`,
      },
      
    ],
  },
  {
    id: 8,
    title: "A* Algorithm for Pathfinding in RTS Game (Python)",
    subdivisions: [
      {
        id: "A* Algorithm Implementation",
        title: "A* Algorithm Implementation",
        content: `
import heapq

# 4-directional movement
moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]

# Terrain movement costs
terrain_costs = {
    '.': 1,   # Open path
    '#': 100, # Wall (very high cost)
    'G': 1,   # Goal
    'S': 1    # Start
}

# Heuristic function (Manhattan distance)
def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# A* Search algorithm
def astar_search(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    cost_so_far = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]

        for dr, dc in moves:
            nr, nc = current[0] + dr, current[1] + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                terrain = grid[nr][nc]
                if terrain == '#':
                    continue  # Skip walls entirely
                new_cost = cost_so_far[current] + terrain_costs.get(terrain, 1)
                if (nr, nc) not in cost_so_far or new_cost < cost_so_far[(nr, nc)]:
                    cost_so_far[(nr, nc)] = new_cost
                    priority = new_cost + heuristic((nr, nc), goal)
                    heapq.heappush(open_set, (priority, (nr, nc)))
                    came_from[(nr, nc)] = current

    return "No path found"

# Example grid
grid = [
    ['S', '.', '.', '#', '.', '.', '.'],
    ['.', '#', '.', '.', '.', '#', '.'],
    ['.', '#', '.', '.', '.', '.', '.'],
    ['.', '.', '#', '#', '.', '.', '.'],
    ['#', '.', '#', 'G', '.', '#', '.']
]

start = (0, 0)
goal = (4, 3)

# Run A* and print path
path = astar_search(grid, start, goal)
print("Path found:" if isinstance(path, list) else "No path:", path)


`,
      },
    ],
  },
  {
    id: 9,
    title: "Alpha-Beta Pruning for Tic-Tac-Toe (Python)",
    subdivisions: [
      {
        id: "Alpha-Beta Pruning for Tic-Tac-Toe (Python)",
        title: "Alpha-Beta Pruning for Tic-Tac-Toe (Python)",
        content: `import math

PLAYER_X = "X"
PLAYER_O = "O"
EMPTY = " "

# Check winner
def check_winner(board):
    wins = [
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]]
    ]
    for line in wins:
        if line[0] == line[1] == line[2] and line[0] != EMPTY:
            return line[0]
    return None

# Check if board is full
def is_full(board):
    return all(cell != EMPTY for row in board for cell in row)

# Alpha-Beta Pruning Algorithm
def alpha_beta_pruning(board, depth, alpha, beta, is_maximizing):
    winner = check_winner(board)
    if winner == PLAYER_X:
        return 10 - depth
    elif winner == PLAYER_O:
        return depth - 10
    elif is_full(board):
        return 0

    if is_maximizing:
        max_eval = -math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == EMPTY:
                    board[i][j] = PLAYER_X
                    score = alpha_beta_pruning(board, depth + 1, alpha, beta, False)
                    board[i][j] = EMPTY
                    max_eval = max(max_eval, score)
                    alpha = max(alpha, score)
                    if beta <= alpha:
                        break
        return max_eval
    else:
        min_eval = math.inf
        for i in range(3):
            for j in range(3):
                if board[i][j] == EMPTY:
                    board[i][j] = PLAYER_O
                    score = alpha_beta_pruning(board, depth + 1, alpha, beta, True)
                    board[i][j] = EMPTY
                    min_eval = min(min_eval, score)
                    beta = min(beta, score)
                    if beta <= alpha:
                        break
        return min_eval

# Determine best move for PLAYER_X
def best_move(board):
    best_score = -math.inf
    move = (-1, -1)
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                board[i][j] = PLAYER_X
                score = alpha_beta_pruning(board, 0, -math.inf, math.inf, False)
                board[i][j] = EMPTY
                if score > best_score:
                    best_score = score
                    move = (i, j)
    return move

# Example board
board = [
    [PLAYER_X, PLAYER_O, PLAYER_X],
    [PLAYER_O, PLAYER_X, EMPTY],
    [PLAYER_O, EMPTY, EMPTY]
]

# Output the best move
optimal_move = best_move(board)
print("Best move for PLAYER_X:", optimal_move)

`,
      },
     
    ],
  },
  {
    id: 10,
    title: " Genetic Algorithm for Package Delivery Optimization",
    subdivisions: [
      {
        id: " Genetic Algorithm for Package Delivery Optimization",
        title: " Genetic Algorithm for Package Delivery Optimization",
        content: `import random

# Delivery Points
delivery_points = ["A", "B", "C", "D", "E", "F", "G", "H"]

# Generate Initial Population
def generate_population(size):
    return [random.sample(delivery_points, len(delivery_points)) for _ in range(size)]

# Fitness Function: negative sum of "distances"
def fitness(route):
    return -sum(abs(ord(route[i]) - ord(route[i+1])) for i in range(len(route) - 1))

# Selection: top 2
def selection(pop):
    return sorted(pop, key=fitness, reverse=True)[:2]

# Order Crossover (OX)
def crossover(p1, p2):
    size = len(p1)
    a, b = sorted(random.sample(range(size), 2))
    middle = p1[a:b]
    remainder = [x for x in p2 if x not in middle]
    child = remainder[:a] + middle + remainder[a:]
    return child

# Mutation: simple swap
def mutation(route):
    i, j = random.sample(range(len(route)), 2)
    route[i], route[j] = route[j], route[i]
    return route

# Main GA Loop
def genetic_algorithm(generations, pop_size):
    population = generate_population(pop_size)
    for _ in range(generations):
        parents = selection(population)
        offspring = []
        while len(offspring) < pop_size:
            child1 = crossover(parents[0], parents[1])
            child2 = crossover(parents[1], parents[0])
            offspring.extend([mutation(child1), mutation(child2)])
        population = offspring
    return sorted(population, key=fitness, reverse=True)[0]

# Run
optimal_route = genetic_algorithm(generations=100, pop_size=20)
print("Optimal delivery route:", optimal_route)

`,
      },
     
    ],
  },
  {
    id: 11,
    title: " Simulated Annealing for Telecom Network Optimization",
    subdivisions: [
      {
        id: " Simulated Annealing for Telecom Network Optimization",
        title: " Simulated Annealing for Telecom Network Optimization",
        content: `import random, math

# Nodes and random connections
nodes = ["A", "B", "C", "D", "E"]
connections = [(random.choice(nodes), random.choice(nodes)) for _ in range(7)]

# Cost = Latency / Throughput
def evaluate_network(net):
    latency = sum(abs(ord(a) - ord(b)) for a, b in net)
    throughput = sum(ord(a) + ord(b) for a, b in net)
    return latency / throughput

# Simulated Annealing Algorithm
def simulated_annealing(network, T=100, cooling=0.95, min_T=0.1):
    current = network[:]
    cost = evaluate_network(current)
    while T > min_T:
        new_net = current[:]
        i = random.randint(0, len(new_net) - 1)
        new_net[i] = (random.choice(nodes), random.choice(nodes))
        new_cost = evaluate_network(new_net)
        delta_E = new_cost - cost
        if delta_E < 0 or random.random() < math.exp(-delta_E / T):
            current, cost = new_net, new_cost
        T *= cooling
    return current

# Run
opt_net = simulated_annealing(connections)
print("Optimized network configuration:", opt_net)

`,
      },
     
    ],
  },
  {
    id: 12,
    title: "  Smart Home Automation using Propositional Logic",
    subdivisions: [
      {
        id: "  Smart Home Automation using Propositional Logic",
        title: "  Smart Home Automation using Propositional Logic",
        content: `from sympy import symbols

# Define propositional symbols
M = symbols("MotionDetected")
D = symbols("DoorOpen")
T = symbols("TemperatureDrop")
O = symbols("OccupancyChange")
N = symbols("NewDevice")

# Inference rules
rules = {
    "LightsOn": M,
    "HeaterOn": T,
    "SecurityAlert": D,
    "UpdateOccupancy": O,
    "ConfigureDevice": N
}

# Infer actions from sensor data
def infer_actions(sensor_data):
    return [action for action, condition in rules.items() if condition in sensor_data]

# Example sensor input
sensor_data = {M, T, O}
actions = infer_actions(sensor_data)
print("Smart Home Actions Taken:", actions)

`,
      },
     
    ],
  },
  {
    id: 13,
    title: "   Medical Diagnosis using Predicate Logic & Resolution",
    subdivisions: [
      {
        id: "  Medical Diagnosis using Predicate Logic & Resolution",
        title: " Medical Diagnosis using Predicate Logic & Resolution",
        content: `class KnowledgeBase:
    def __init__(self):
        self.facts = []
        self.rules = []

    def add_fact(self, fact):
        self.facts.append(fact)

    def add_rule(self, premise, conclusion):
        self.rules.append((premise, conclusion))

    def infer(self, query):
        inferred = set()
        pending = [query]
        while pending:
            current = pending.pop()
            if current in self.facts:
                inferred.add(current)
                continue
            for premise, conclusion in self.rules:
                if current == conclusion and all(p in inferred or p in self.facts for p in premise):
                    inferred.add(current)
                    pending.extend(premise)
        return query in inferred

# Initialize knowledge base
kb = KnowledgeBase()

# Add symptom facts
kb.add_fact("has_symptom(Patient, Fever)")
kb.add_fact("has_symptom(Patient, Cough)")

# Add rules for disease diagnosis and treatment
kb.add_rule(["has_symptom(Patient, Fever)", "has_symptom(Patient, Cough)"], "has_disease(Patient, Flu)")
kb.add_rule(["has_disease(Patient, Flu)"], "treatment_for(Flu, Antiviral)")

# Run inference queries
diagnosis = kb.infer("has_disease(Patient, Flu)")
treatment = kb.infer("treatment_for(Flu, Antiviral)")

print(f"Diagnosis for Patient: {'Flu' if diagnosis else 'Unknown'}")
print(f"Recommended Treatment: {'Antiviral' if treatment else 'No Treatment Suggested'}")

`,
      },
     
    ],
  },
];