# Learn more: http://github.com/javan/whenever
require 'socket'
host_name = Socket.gethostname

app_name = 'rails'
backup_file = "/srv/www/#{app_name}/current/config/backup.rb"
rails_env = ENV['RAILS_ENV'] || ENV['RACK_ENV']

env :CRON_TZ, 'Japan'
env :PATH, '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
env :MASTER_HOST, ENV['MASTER_HOST']
env :RAILS_ENV, rails_env

set :environment, rails_env
set :job_template, nil
set :path, "/srv/www/#{app_name}/current"
set :output, "/srv/www/#{app_name}/current/log/batch.log"
set :estimate_time, 180
job_type :rake, 'cd :path && bundle exec rake :task :output'
job_type :backup, 'cd :path && backup perform :task :output'
job_type :runner, "cd :path && script/runner -e :environment ':task' :output"
job_type :jobmon, 'cd :path && bundle exec jobmon --estimate-time :estimate_time :task  :output'

if rails_env == 'production'
  if host_name == ENV['MASTER_HOST']
    every 1.day, at: '2:00 am' do
      backup "-t #{host_name}_data --config_file '#{backup_file}'"
    end
  end

  every 1.day, at: '7:10 am' do
    backup "-t #{host_name}_log --config_file '#{backup_file}'"
  end
end

if host_name == ENV['MASTER_HOST']
  every 1.day, at: '07:00' do
    jobmon 'cron:auto_cancel_requests'
  end

  every '12 * * * *' do
    jobmon 'cron:notice_many_jobs'
  end

  every '14 * * * *' do
    jobmon 'dekiru:smtp_check'
  end
end

every 5.minutes do
  jobmon 'cosuka_opsworks:watch_disk_space'
end
