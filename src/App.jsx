import { useState } from "react";

const experimentsData = [
  {
    id: 1,
    title: "1) Experiment One",
    content: `This is the content for experiment one.`,
  },
  {
    id: 2,
    title: "2) Experiment Two",
    content: `Content for experiment two without subdivisions.`,
  },
  {
    id: 3,
    title: "3) System Call",
    subdivisions: [
      {
        id: "fork",
        title: "Fork System Call",
        content: `/* Process creation - fork.c */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>

int main()
{
    pid_t pid;
    int x = 5;

    pid = fork(); // Create child process
    x++; // Both processes increment x (they have their own copy)

    if (pid < 0)
    {
        printf("Process creation error\\n");
        exit(-1);
    }
    else if (pid == 0)
    {
        // Child process
        printf("\\nChild process:");
        printf("\\nProcess ID is %d", getpid());
        printf("\\nValue of x is %d", x);
        printf("\\nProcess ID of parent is %d\\n", getppid());
    }
    else
    {
        // Parent process
        printf("\\nParent process:");
        printf("\\nProcess ID is %d", getpid());
        printf("\\nValue of x is %d", x);
        printf("\\nProcess ID of shell is %d\\n", getppid());
    }

    return 0;
}`,
      },
      {
        id: "wait",
        title: "Wait System Call",
        content: `#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>  // Required for wait()

int main() {
    pid_t pid;
    int status;

    pid = fork();

    if (pid < 0) {
        printf("Fork failed.\n");
        exit(1);
    }
    else if (pid == 0) {
        // Child process
        printf("Child Process: PID = %d\n", getpid());
        sleep(2);  // Simulate some work
        printf("Child finished.\n");
        exit(0);   // Exit normally
    }
    else {
        // Parent process
        printf("Parent waiting for child to finish...\n");
        wait(&status);  // Wait for child to finish
        printf("Child exited with status %d\n", WEXITSTATUS(status));
        printf("Parent Process: PID = %d\n", getpid());
    }

    return 0;
}
`,
      },
      {
        id: "Exec",
        title: "Exec System Call",
        content: `#include <unistd.h>
int main() {
    // Replace current program with /bin/ls, arguments: ls -l /home
    execl("/bin/ls", "ls", "-l", "/home", NULL);
    // If exec fails:
    perror("execl failed");
    return 1;
}
`,
      },
      {
        id: "Stat",
        title: "Stat System Call",
        content: `#include <stdio.h>
#include <sys/stat.h>
#include <time.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        printf("Usage: %s <filename>\n", argv[0]);
        return 1;
    }

    struct stat fileStat;

    if (stat(argv[1], &fileStat) < 0) {
        perror("stat error");
        return 1;
    }

    printf("Information for %s:\n", argv[1]);
    printf("File Size: %ld bytes\n", fileStat.st_size);
    printf("Number of Links: %ld\n", fileStat.st_nlink);
    printf("File inode: %ld\n", fileStat.st_ino);

    printf("File Permissions: ");
    printf( (S_ISDIR(fileStat.st_mode)) ? "d" : "-");
    printf( (fileStat.st_mode & S_IRUSR) ? "r" : "-");
    printf( (fileStat.st_mode & S_IWUSR) ? "w" : "-");
    printf( (fileStat.st_mode & S_IXUSR) ? "x" : "-");
    printf( (fileStat.st_mode & S_IRGRP) ? "r" : "-");
    printf( (fileStat.st_mode & S_IWGRP) ? "w" : "-");
    printf( (fileStat.st_mode & S_IXGRP) ? "x" : "-");
    printf( (fileStat.st_mode & S_IROTH) ? "r" : "-");
    printf( (fileStat.st_mode & S_IWOTH) ? "w" : "-");
    printf( (fileStat.st_mode & S_IXOTH) ? "x" : "-");
    printf("\n");

    printf("Last Accessed: %s", ctime(&fileStat.st_atime));
    printf("Last Modified: %s", ctime(&fileStat.st_mtime));
    printf("Last Status Change: %s", ctime(&fileStat.st_ctime));

    return 0;
}

`,
      },
      {
        id: "IPC",
        title: "Inter Process Communication",
        content: `
// ==========================
// 1. IPC using popen() and pclose()
// File: popen_example.c
// ==========================
#include <stdio.h>

int main() {
    FILE *fp;
    char buffer[100];

    // Run 'ls' command and read its output
    fp = popen("ls", "r");
    if (fp == NULL) {
        perror("popen failed");
        return 1;
    }

    printf("Output of 'ls':\\n");
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    pclose(fp);
    return 0;
}

// ==========================
// 2. IPC using pipe()
// File: pipe_example.c
// ==========================
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main() {
    int fd[2];
    pid_t pid;
    char write_msg[] = "Hello from parent";
    char read_msg[100];

    pipe(fd);
    pid = fork();

    if (pid == 0) {
        // Child process
        close(fd[1]); // Close write end
        read(fd[0], read_msg, sizeof(read_msg));
        printf("Child received: %s\\n", read_msg);
    } else {
        // Parent process
        close(fd[0]); // Close read end
        write(fd[1], write_msg, strlen(write_msg) + 1);
    }

    return 0;
}

// ==========================
// 3. IPC using Named Pipe (FIFO)
// ==========================

// --- File: 1.c (Create FIFO) ---
#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>

int main() {
    if (mkfifo("myfifo", 0666) == -1) {
        perror("mkfifo");
    } else {
        printf("FIFO created successfully.\\n");
    }
    return 0;
}

// --- File: sender.c (Write to FIFO) ---
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main() {
    int fd;
    char *msg = "Hello from sender";

    fd = open("myfifo", O_WRONLY);
    write(fd, msg, strlen(msg) + 1);
    close(fd);

    return 0;
}

// --- File: receiver.c (Read from FIFO) ---
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main() {
    int fd;
    char buffer[100];

    fd = open("myfifo", O_RDONLY);
    read(fd, buffer, sizeof(buffer));
    printf("Receiver got: %s\\n", buffer);
    close(fd);

    return 0;
}
`,
      },
    ],
  },
  {
    id: 5,
    title: "5) Threads",
    subdivisions: [
      {
        id: "Threads",
        title: "Threads",
        content: `// thread_example.c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>

void* thread_function(void *arg); // Thread function prototype

int i, n, j;

int main() {
    char *m = "5"; // Pass value as string
    pthread_t a_thread; // Thread declaration
    void *result;

    // Create the thread
    pthread_create(&a_thread, NULL, thread_function, m);

    // Wait for the thread to complete
    pthread_join(a_thread, &result);

    printf("Thread joined\n");

    // Main thread work
    for (j = 20; j < 25; j++) {
        printf("%d\n", j);
        sleep(1);
    }

    // Print the return message from thread
    printf("Thread returned: %s\n", (char *)result);

    return 0;
}

// Thread function
void* thread_function(void *arg) {
    int sum = 0;
    n = atoi((char *)arg); // Convert passed string to integer

    for (i = 0; i < n; i++) {
        printf("%d\n", i);
        sleep(1);
    }

    pthread_exit("Done"); // Return message from thread
}

`,
      },
      {
        id: "Syncroniazation",
        title: "Syncroniazation using mutex",
        content: `// synchronization_example.c

#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int counter = 0;                  // Shared variable
pthread_mutex_t lock;            // Mutex declaration

void* increment_counter(void* arg) {
    for (int i = 0; i < 5; i++) {
        pthread_mutex_lock(&lock);       // Lock the critical section
        int val = counter;
        printf("Thread %ld: counter before = %d\n", (long)pthread_self(), val);
        val++;
        counter = val;
        printf("Thread %ld: counter after = %d\n", (long)pthread_self(), counter);
        pthread_mutex_unlock(&lock);     // Unlock after updating
        sleep(1);                        // Simulate delay
    }
    return NULL;
}

int main() {
    pthread_t t1, t2;

    pthread_mutex_init(&lock, NULL);    // Initialize mutex

    pthread_create(&t1, NULL, increment_counter, NULL);
    pthread_create(&t2, NULL, increment_counter, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("Final counter value: %d\n", counter);

    pthread_mutex_destroy(&lock);      // Clean up
    return 0;
}

`,
      },
    ],
  },
  {
    id: 6,
    title: "6) Scheduling",
    subdivisions: [
      {
        id: "FCFS",
        title: "FCFS",
        content: `// fcfs_scheduling.c
#include <stdio.h>

int main() {
    int n, i;
    int bt[20], wt[20], tat[20];
    float avg_wt = 0, avg_tat = 0;

    printf("Enter the number of processes: ");
    scanf("%d", &n);

    printf("Enter burst time for each process:\n");
    for (i = 0; i < n; i++) {
        printf("Process %d: ", i + 1);
        scanf("%d", &bt[i]);
    }

    // Waiting time for first process is 0
    wt[0] = 0;

    // Calculate waiting time for each process
    for (i = 1; i < n; i++) {
        wt[i] = wt[i - 1] + bt[i - 1];
    }

    // Calculate turnaround time for each process
    for (i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
    }

    printf("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time\n");
    for (i = 0; i < n; i++) {
        printf("P%d\t%d\t\t%d\t\t%d\n", i + 1, bt[i], wt[i], tat[i]);
        avg_wt += wt[i];
        avg_tat += tat[i];
    }

    printf("\nAverage Waiting Time = %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time = %.2f\n", avg_tat / n);

    return 0;
}

`,
      },
      {
        id: "sjf",
        title: "sjf",
        content: `// sjf_scheduling.c
#include <stdio.h>

int main() {
    int n, i, j, pos, temp;
    int bt[20], p[20], wt[20], tat[20];
    float avg_wt = 0, avg_tat = 0;

    printf("Enter number of processes: ");
    scanf("%d", &n);

    printf("Enter Burst Time for each process:\n");
    for (i = 0; i < n; i++) {
        printf("Process %d: ", i + 1);
        scanf("%d", &bt[i]);
        p[i] = i + 1;  // Process ID
    }

    // Sort processes by burst time using selection sort
    for (i = 0; i < n; i++) {
        pos = i;
        for (j = i + 1; j < n; j++) {
            if (bt[j] < bt[pos])
                pos = j;
        }

        // Swap burst times
        temp = bt[i];
        bt[i] = bt[pos];
        bt[pos] = temp;

        // Swap process numbers
        temp = p[i];
        p[i] = p[pos];
        p[pos] = temp;
    }

    // First process has 0 waiting time
    wt[0] = 0;

    // Calculate waiting time
    for (i = 1; i < n; i++) {
        wt[i] = 0;
        for (j = 0; j < i; j++)
            wt[i] += bt[j];

        avg_wt += wt[i];
    }

    // Calculate turnaround time
    for (i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
        avg_tat += tat[i];
    }

    printf("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time\n");
    for (i = 0; i < n; i++) {
        printf("P%d\t%d\t\t%d\t\t%d\n", p[i], bt[i], wt[i], tat[i]);
    }

    printf("\nAverage Waiting Time = %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time = %.2f\n", avg_tat / n);

    return 0;
}

`,
      },
      {
        id: "RoundRobin",
        title: "RoundRobin",
        content: `// round_robin.c
#include <stdio.h>

int main() {
    int i, n, bt[10], wt[10], tat[10], rem_bt[10];
    int quantum, time = 0;

    printf("Enter the number of processes: ");
    scanf("%d", &n);

    printf("Enter burst time for each process:\n");
    for (i = 0; i < n; i++) {
        printf("P%d: ", i + 1);
        scanf("%d", &bt[i]);
        rem_bt[i] = bt[i]; // store remaining burst time
    }

    printf("Enter time quantum: ");
    scanf("%d", &quantum);

    int done;
    do {
        done = 1;
        for (i = 0; i < n; i++) {
            if (rem_bt[i] > 0) {
                done = 0;
                if (rem_bt[i] > quantum) {
                    time += quantum;
                    rem_bt[i] -= quantum;
                } else {
                    time += rem_bt[i];
                    wt[i] = time - bt[i];
                    rem_bt[i] = 0;
                }
            }
        }
    } while (!done);

    // Calculate Turnaround Time
    for (i = 0; i < n; i++) {
        tat[i] = bt[i] + wt[i];
    }

    // Print results
    printf("\nProcess\tBurst Time\tWaiting Time\tTurnaround Time\n");
    for (i = 0; i < n; i++) {
        printf("P%d\t%d\t\t%d\t\t%d\n", i + 1, bt[i], wt[i], tat[i]);
    }

    // Average times
    float avg_wt = 0, avg_tat = 0;
    for (i = 0; i < n; i++) {
        avg_wt += wt[i];
        avg_tat += tat[i];
    }

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);

    return 0;
}

`,
      },
      {
        id: "Priority",
        title: "Priority",
        content: `#include <stdio.h>

struct Process {
    int id;
    int bt;     // Burst Time
    int priority;
    int wt;     // Waiting Time
    int tat;    // Turnaround Time
};

void sortByPriority(struct Process p[], int n) {
    struct Process temp;
    for (int i = 0; i < n-1; i++) {
        for (int j = i+1; j < n; j++) {
            if (p[i].priority > p[j].priority) {
                temp = p[i];
                p[i] = p[j];
                p[j] = temp;
            }
        }
    }
}

int main() {
    int n;
    struct Process p[10];

    printf("Enter number of processes: ");
    scanf("%d", &n);

    for (int i = 0; i < n; i++) {
        p[i].id = i + 1;
        printf("Enter burst time and priority for process P%d: ", p[i].id);
        scanf("%d %d", &p[i].bt, &p[i].priority);
    }

    // Sort processes based on priority
    sortByPriority(p, n);

    // Calculate Waiting Time
    p[0].wt = 0;
    for (int i = 1; i < n; i++) {
        p[i].wt = p[i-1].wt + p[i-1].bt;
    }

    // Calculate Turnaround Time
    for (int i = 0; i < n; i++) {
        p[i].tat = p[i].wt + p[i].bt;
    }

    // Display Results
    printf("\nProcess\tBurst Time\tPriority\tWaiting Time\tTurnaround Time\n");
    for (int i = 0; i < n; i++) {
        printf("P%d\t%d\t\t%d\t\t%d\t\t%d\n", p[i].id, p[i].bt, p[i].priority, p[i].wt, p[i].tat);
    }

    // Average Times
    float avg_wt = 0, avg_tat = 0;
    for (int i = 0; i < n; i++) {
        avg_wt += p[i].wt;
        avg_tat += p[i].tat;
    }

    printf("\nAverage Waiting Time: %.2f", avg_wt / n);
    printf("\nAverage Turnaround Time: %.2f\n", avg_tat / n);

    return 0;
}

`,
      },
    ],
  },
  {
    id: 7,
    title: "7)CPU schduling",
    subdivisions: [
      {
        id: "Producer consumer",
        title: "Producer consumer",
        content: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define SIZE 5  // Buffer size

int buffer[SIZE];
int in = 0, out = 0;

sem_t empty;   // Counts empty slots
sem_t full;    // Counts full slots
pthread_mutex_t mutex;  // Mutex for critical section

void* producer(void* arg) {
    int item;
    for (int i = 0; i < 10; i++) {
        item = rand() % 100;  // Produce item
        sem_wait(&empty);     // Decrement empty count
        pthread_mutex_lock(&mutex);  // Lock critical section

        buffer[in] = item;
        printf("Producer produced: %d at %d\n", item, in);
        in = (in + 1) % SIZE;

        pthread_mutex_unlock(&mutex);  // Unlock
        sem_post(&full);     // Increment full count

        sleep(1);
    }
    return NULL;
}

void* consumer(void* arg) {
    int item;
    for (int i = 0; i < 10; i++) {
        sem_wait(&full);    // Decrement full count
        pthread_mutex_lock(&mutex);  // Lock critical section

        item = buffer[out];
        printf("Consumer consumed: %d from %d\n", item, out);
        out = (out + 1) % SIZE;

        pthread_mutex_unlock(&mutex);  // Unlock
        sem_post(&empty);   // Increment empty count

        sleep(2);
    }
    return NULL;
}

int main() {
    pthread_t prod, cons;

    sem_init(&empty, 0, SIZE);
    sem_init(&full, 0, 0);
    pthread_mutex_init(&mutex, NULL);

    pthread_create(&prod, NULL, producer, NULL);
    pthread_create(&cons, NULL, consumer, NULL);

    pthread_join(prod, NULL);
    pthread_join(cons, NULL);

    sem_destroy(&empty);
    sem_destroy(&full);
    pthread_mutex_destroy(&mutex);

    return 0;
}

`,
      },
      {
        id: "Diningphilosopher",
        title: "Dining philosopher",
        content: `#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5 // Number of philosophers

sem_t forks[N];          // One semaphore per fork
pthread_t philosopher[N]; // Threads for philosophers
int phil_id[N];          // Philosopher IDs

void* dine(void* num) {
    int id = *(int*)num;
    while (1) {
        // Thinking
        printf("Philosopher %d is thinking...\n", id);
        sleep(rand() % 3 + 1);

        // Hungry
        printf("Philosopher %d is hungry...\n", id);

        // Pick up left and right fork (use order to prevent deadlock)
        sem_wait(&forks[id]);              // Left fork
        sem_wait(&forks[(id + 1) % N]);    // Right fork

        // Eating
        printf("Philosopher %d is eating using forks %d and %d\n", id, id, (id + 1) % N);
        sleep(rand() % 2 + 1);

        // Put down forks
        sem_post(&forks[id]);              // Release left fork
        sem_post(&forks[(id + 1) % N]);    // Release right fork

        printf("Philosopher %d finished eating and put down forks.\n", id);
    }
}

int main() {
    // Initialize semaphores
    for (int i = 0; i < N; i++) {
        sem_init(&forks[i], 0, 1); // Each fork is available (value = 1)
        phil_id[i] = i;            // Assign ID
    }

    // Create philosopher threads
    for (int i = 0; i < N; i++) {
        pthread_create(&philosopher[i], NULL, dine, &phil_id[i]);
    }

    // Join threads (infinite loop, will not terminate)
    for (int i = 0; i < N; i++) {
        pthread_join(philosopher[i], NULL);
    }

    // Destroy semaphores (never reached in this example)
    for (int i = 0; i < N; i++) {
        sem_destroy(&forks[i]);
    }

    return 0;
}

`,
      },
     
    ],
  },
];

export default function App() {
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [selectedSubId, setSelectedSubId] = useState(null);

  const onExpClick = (id) => {
    setSelectedExpId(id);
    setSelectedSubId(null);
  };

  const onSubClick = (id) => {
    setSelectedSubId(id === selectedSubId ? null : id);
  };

  if (selectedExpId === null) {
    return (
      <div style={{ padding: "10px" }}>
        <h2>Lab Practical Experiments</h2>
        <ul style={{ paddingLeft: 0 }}>
          {experimentsData.map((exp) => (
            <li
              key={exp.id}
              style={{ cursor: "pointer", marginBottom: "8px", listStyle: "none" }}
              onClick={() => onExpClick(exp.id)}
            >
              {exp.title}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const exp = experimentsData.find((e) => e.id === selectedExpId);

  return (
    <div style={{ padding: "10px" }}>
      <button onClick={() => { setSelectedExpId(null); setSelectedSubId(null); }} style={{ marginBottom: "15px" }}>
        &lt; Back to Experiments
      </button>

      <h2>{exp.title}</h2>

      {exp.subdivisions ? (
        <div>
          <h3>Subdivisions</h3>
          <ul style={{ paddingLeft: 0 }}>
            {exp.subdivisions.map((sub) => (
              <li
                key={sub.id}
                style={{ cursor: "pointer", marginBottom: "5px", listStyle: "none" }}
                onClick={() => onSubClick(sub.id)}
              >
                {sub.title}
              </li>
            ))}
          </ul>

          {selectedSubId && (
            <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px" }}>
              {exp.subdivisions.find((s) => s.id === selectedSubId).content}
            </pre>
          )}
        </div>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", border: "1px solid #ccc", padding: "10px" }}>
          {exp.content}
        </pre>
      )}
    </div>
  );
}
