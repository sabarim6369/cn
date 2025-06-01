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
`
}

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
