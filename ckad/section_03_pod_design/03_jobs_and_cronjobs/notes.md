# Jobs and CronJobs

## What is it?
A **Job** creates one or more Pods and ensures a specified number of them complete successfully. Unlike a Deployment, it is designed for finite, run-to-completion workloads. A **CronJob** schedules a Job to run repeatedly on a time-based schedule using standard cron syntax.

## Key Characteristics

### Job
- Defined with `apiVersion: batch/v1` and `kind: Job`.
- Runs until `completions` successful Pod terminations are reached.
- `parallelism` controls how many Pods run simultaneously.
- `backoffLimit` sets the number of retries before the Job is marked as failed.
- Pod `restartPolicy` must be `Never` or `OnFailure` — `Always` is not allowed.
- Completed Pods are kept (not deleted) so logs remain accessible until the Job is deleted.
- Use case: database migrations, batch processing, report generation.

### CronJob
- Defined with `kind: CronJob`; wraps a `jobTemplate` that follows the same spec as a Job.
- `schedule` uses standard 5-field cron syntax: `minute hour day-of-month month day-of-week`.
- Each scheduled run creates a new Job object.
- `successfulJobsHistoryLimit` (default 3) and `failedJobsHistoryLimit` (default 1) control how many past Job objects are retained.
- Use case: nightly backups, periodic health checks, scheduled reports.

## Commands

```kubectl
# --- Job ---

# Create a Job
kubectl apply -f 01_job_basic.yaml

# List Jobs
kubectl get jobs

# Watch Job progress (COMPLETIONS column)
kubectl get job pi-job -w

# View logs of the Pod created by the Job
kubectl logs -l job-name=pi-job

# Delete the Job (also deletes its Pods)
kubectl delete job pi-job

# --- CronJob ---

# Create a CronJob
kubectl apply -f 02_cronjob_basic.yaml

# List CronJobs
kubectl get cronjobs

# Describe a CronJob (shows schedule and last run time)
kubectl describe cronjob hello-cronjob

# Manually trigger a Job from a CronJob immediately
kubectl create job --from=cronjob/hello-cronjob hello-manual-run

# Delete the CronJob
kubectl delete cronjob hello-cronjob
```
