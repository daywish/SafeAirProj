using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SafeAirProj.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SafeAirProj.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
        public virtual DbSet<Buildings> Buildings { get; set; }
        public virtual DbSet<Conditioners> Conditioners { get; set; }
        public virtual DbSet<Emploees> Emploees { get; set; }
        public virtual DbSet<Floors> Floors { get; set; }
        public virtual DbSet<Requests> Requests { get; set; }
        public virtual DbSet<Rooms> Rooms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=aspnet-SafeAirProj-53bc9b9d-9d6a-45d4-8429-2a2761773502;Trusted_Connection=True;MultipleActiveResultSets=true");
            }
        }

        //private extern void OnModelCreatingPartial(ModelBuilder modelBuilder);

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Buildings>(entity =>
            {
                entity.HasKey(e => e.BuildingId)
                    .HasName("PK__Building__5463CDC423ED712C");

                entity.Property(e => e.BuildingAddres)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.BuildingName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.OwnerId).HasMaxLength(450);

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.Buildings)
                    .HasForeignKey(d => d.OwnerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Buildings__Owner__5EBF139D");
            });

            modelBuilder.Entity<Conditioners>(entity =>
            {
                entity.HasKey(e => e.ConditionerId)
                    .HasName("PK__Conditio__DCB8322D239E917B");

                entity.Property(e => e.ConditionerCost).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.ConditionerName)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<Emploees>(entity =>
            {
                entity.HasKey(e => e.EmploeeId)
                    .HasName("PK__Emploees__0DA831E99E782441");

                entity.Property(e => e.EmploeeFirstName)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.EmploeeLastName)
                    .IsRequired()
                    .HasMaxLength(30);
            });

            modelBuilder.Entity<Floors>(entity =>
            {
                entity.HasKey(e => e.FloorId)
                    .HasName("PK__Floors__49D1E84B3A068695");

                entity.HasOne(d => d.Building)
                    .WithMany(p => p.Floors)
                    .HasForeignKey(d => d.BuildingId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Floors__Building__619B8048");
            });

            modelBuilder.Entity<Requests>(entity =>
            {
                entity.HasKey(e => e.RequestId)
                    .HasName("PK__Requests__33A8517A5586B275");

                entity.HasOne(d => d.Emploee)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.EmploeeId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Requests__Emploe__6B24EA82");

                entity.HasOne(d => d.Room)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.RoomId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Requests__RoomId__6A30C649");
            });

            modelBuilder.Entity<Rooms>(entity =>
            {
                entity.HasKey(e => e.RoomId)
                    .HasName("PK__Rooms__32863939EB548CC0");

                entity.HasOne(d => d.Conditioner)
                    .WithMany(p => p.Rooms)
                    .HasForeignKey(d => d.ConditionerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Rooms__Condition__6754599E");

                entity.HasOne(d => d.Floor)
                    .WithMany(p => p.Rooms)
                    .HasForeignKey(d => d.FloorId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK__Rooms__FloorId__66603565");
            });

            /*OnModelCreating(modelBuilder);*/
        }
        
    }
}
